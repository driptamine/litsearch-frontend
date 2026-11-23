import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { chatRequest, tokenUser } from 'core/api/chatSession';
import { useNotifications } from 'core/context/NotificationContext';
import useChatSocket from 'core/hooks/useChatSocket';
import useVoip from 'core/hooks/useVoip';
import useGroupVoice from 'core/hooks/useGroupVoice';
import getAuthToken from 'core/utils/getAuthToken';
import CallOverlay from 'views/pages/ChatV3/Main/CallOverlay';
import IncomingCallOverlay from 'views/pages/ChatV3/Main/IncomingCallOverlay';
import GroupVoicePanel from 'views/pages/ChatV3/Main/GroupVoicePanel';

const CallContext = createContext(null);

export const useCalls = () => useContext(CallContext);

const unavailable = 'Could not connect the call. Close it and try again.';

async function callCommand(call, type, payload = {}) {
  const { data } = await chatRequest(`/chats/${call.chatId}/call/`, {
    method: 'post',
    data: { type, call_id: call.id, ...payload },
  });
  return data;
}

export function CallProvider({ children }) {
  const {
    incomingCall, closedCall, clearIncomingCall, receiveIncomingCall, subscribeToCalls, isOnline,
  } = useNotifications();
  const accessToken = useSelector(state => state.users?.access_token) || getAuthToken();
  const account = tokenUser(accessToken);
  const [call, setCall] = useState(null);
  const [callState, setCallState] = useState('idle');
  const [signalError, setSignalError] = useState(null);
  const callRef = useRef(null);
  const eventHandler = useRef(null);
  const audioContextRef = useRef(null);
  const ringTimeout = useRef(null);
  const sendSignal = useCallback(signal => {
    const current = callRef.current;
    if (!current?.id || !current.accepted) return;
    callCommand(current, 'voip_webrtc_signal', { signal_data: signal }).catch(() => {
      if (signal.type !== 'candidate' && callRef.current === current) setSignalError(unavailable);
    });
  }, []);

  const {
    iceServers, localStream, remoteStream, callError, connected, createOffer,
    handleRemoteSignal, startMedia, endCall: stopMedia,
  } = useVoip({ enabled: Boolean(account), onSignal: sendSignal });
  const groupVoice = useGroupVoice(account, iceServers);
  const pending = account && !call && !groupVoice.session ? incomingCall : null;
  const roomId = account ? call?.chatId ?? pending?.chatId : null;

  const resetCall = useCallback(() => {
    clearTimeout(ringTimeout.current);
    callRef.current = null;
    stopMedia();
    const context = audioContextRef.current;
    audioContextRef.current = null;
    if (context) context.close().catch(() => {});
    setCall(null);
    setSignalError(null);
    setCallState('idle');
  }, [stopMedia]);

  const handleRemoteEnd = (event) => {
    if (pending && event.call_id === pending.id) clearIncomingCall(pending);
    const current = callRef.current;
    if (current?.id != null && event.call_id === current.id) resetCall();
  };

  const handleRemoteAccept = (event) => {
    const current = callRef.current;
    if (current?.direction !== 'outgoing' || current.chatId !== event.chat_id || current.accepted) return;
    if (current.id == null) {
      current.earlyAcceptance = event;
      return;
    }
    if (event.call_id !== current.id) return;
    clearTimeout(ringTimeout.current);
    current.accepted = true;
    setCallState('connecting');
    createOffer();
  };

  const handleSignal = (signal, event) => {
    const current = callRef.current;
    if (!current?.accepted || current.id !== event.call_id) return;
    if (signal?.type === 'offer' && current.direction !== 'incoming') return;
    if (event.signal_id) {
      if (current.seenSignals.has(event.signal_id)) return;
      current.seenSignals.add(event.signal_id);
    }
    handleRemoteSignal(signal);
  };

  eventHandler.current = (event) => {
    if (event.type === 'call_accepted') handleRemoteAccept(event);
    if (event.type === 'voip_webrtc_signal') handleSignal(event.signal_data, event);
  };

  useEffect(() => subscribeToCalls(event => eventHandler.current(event)), [subscribeToCalls]);

  // The conversation channel can still receive WebRTC signals during a notification reconnect.
  useChatSocket(roomId, {
    enabled: !isOnline,
    onVoipCallAccept: handleRemoteAccept,
    onVoipCallEnd: handleRemoteEnd,
    onVoipCallReject: handleRemoteEnd,
    onVoipWebRtcSignal: handleSignal,
  });
  useEffect(() => resetCall, [account, resetCall]);

  useEffect(() => {
    if (connected && callRef.current) {
      setSignalError(null);
      setCallState('connected');
    }
  }, [connected]);

  useEffect(() => {
    if (!closedCall) return;
    if (incomingCall?.id === closedCall.id) clearIncomingCall(incomingCall);
    const current = callRef.current;
    if (current && current.id === closedCall.id) resetCall();
  }, [closedCall, incomingCall, clearIncomingCall, resetCall, callState]);

  useEffect(() => {
    if (!pending?.expiresAt) return;
    const timeout = setTimeout(() => clearIncomingCall(pending), Math.max(0, Date.parse(pending.expiresAt) - Date.now()));
    return () => clearTimeout(timeout);
  }, [pending, clearIncomingCall]);

  useEffect(() => {
    if (!account || call || incomingCall) return;
    const controller = new AbortController();
    let loading = false;
    const restoreRingingCall = async () => {
      if (loading || document.visibilityState !== 'visible') return;
      loading = true;
      try {
        const { data } = await chatRequest('/chats/calls/incoming/', { signal: controller.signal });
        if (!controller.signal.aborted) receiveIncomingCall(data.incoming_call);
      } catch {
        // Reconnect, polling, or returning to the tab will retry.
      } finally {
        loading = false;
      }
    };
    restoreRingingCall();
    const interval = isOnline ? undefined : setInterval(restoreRingingCall, 4000);
    document.addEventListener('visibilitychange', restoreRingingCall);
    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', restoreRingingCall);
    };
  }, [account, call, incomingCall, isOnline, receiveIncomingCall]);

  useEffect(() => {
    if (callState !== 'connecting') return;
    const timeout = setTimeout(() => setSignalError(unavailable), 25000);
    return () => clearTimeout(timeout);
  }, [callState]);

  useEffect(() => {
    if (!call?.id || (callState !== 'calling' && callState !== 'connecting' && callState !== 'connected')) return;
    const pollInterval = callState === 'connected' ? (isOnline ? 15000 : 4000) : 800;
    const controller = new AbortController();
    let timer;
    let shouldPoll = true;
    const syncCall = async () => {
      try {
        const { data } = await chatRequest(`/chats/${call.chatId}/call/`, {
          params: { call_id: call.id, signals: callState === 'connecting' ? 1 : 0 },
          signal: controller.signal,
        });
        if (controller.signal.aborted || callRef.current !== call) return;
        if (data.status === 'completed' || data.status === 'rejected') {
          shouldPoll = false;
          resetCall();
          return;
        }
        if (data.status === 'expired') {
          shouldPoll = false;
          setSignalError('No one answered the call.');
          return;
        }
        if (data.status === 'ongoing') {
          eventHandler.current({ ...data, type: 'call_accepted' });
          data.signals?.forEach(event => eventHandler.current(event));
        }
      } catch {
        // The live delivery paths can continue while the next status check retries.
      } finally {
        if (shouldPoll && !controller.signal.aborted) {
          timer = setTimeout(syncCall, pollInterval);
        }
      }
    };
    syncCall();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [call, callState, isOnline, resetCall]);

  const prepareCall = async (details, direction) => {
    if (callRef.current) return;
    const type = details.callType === 'video' ? 'video' : 'audio';
    const next = { ...details, callType: type, direction, accepted: false, seenSignals: new Set() };
    callRef.current = next;
    setCall(next);
    setCallState('starting');

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      try {
        const context = new AudioContext();
        audioContextRef.current = context;
        context.resume().catch(() => {});
      } catch {}
    }

    if (!await startMedia(type)) {
      if (direction === 'incoming' && callRef.current === next) {
        callCommand(next, 'voip_call_reject').catch(() => {});
      }
      return;
    }
    if (details.delayMs) await new Promise(resolve => setTimeout(resolve, details.delayMs));
    if (callRef.current !== next) return;

    try {
      if (direction === 'incoming') {
        next.accepted = true;
        try {
          await callCommand(next, 'voip_call_accept');
        } catch (error) {
          if (error.response || callRef.current !== next) throw error;
          await callCommand(next, 'voip_call_accept');
        }
        if (callRef.current === next) {
          setCallState(state => state === 'connected' ? state : 'connecting');
        } else if (tokenUser(getAuthToken()) === account) {
          callCommand(next, 'voip_call_end').catch(() => {});
        }
        return;
      }

      const started = await callCommand(next, 'voip_call_start', { call_type: type });
      next.id = started.call_id;
      if (callRef.current !== next) {
        if (tokenUser(getAuthToken()) === account) callCommand(next, 'voip_call_end').catch(() => {});
        return;
      }
      setCallState('calling');
      const expiresIn = Date.parse(started.expires_at) - Date.now();
      ringTimeout.current = setTimeout(() => {
        if (callRef.current !== next || next.accepted) return;
        setSignalError('No one answered the call.');
        callCommand(next, 'voip_call_end').catch(() => {});
      }, Number.isFinite(expiresIn) ? Math.max(0, expiresIn) : 45000);
      if (next.earlyAcceptance) eventHandler.current(next.earlyAcceptance);
    } catch (error) {
      if (callRef.current !== next) return;
      setSignalError(error.response?.data?.detail || error.response?.data?.error || unavailable);
    }
  };

  const startCall = (details) => {
    if (account && details.chatId && !pending && !groupVoice.session) prepareCall(details, 'outgoing');
  };

  const joinGroupVoice = (details) => {
    if (!callRef.current && !pending) groupVoice.join(details);
  };

  const acceptCall = () => {
    if (!pending) return;
    prepareCall(pending, 'incoming');
    clearIncomingCall(pending);
  };

  const declineCall = () => {
    if (!pending) return;
    clearIncomingCall(pending);
    callCommand(pending, 'voip_call_reject').catch(() => {});
  };

  const endCall = () => {
    const current = callRef.current;
    if (current?.id != null) {
      const type = current.direction === 'incoming' && !current.accepted ? 'voip_call_reject' : 'voip_call_end';
      callCommand(current, type).catch(() => {});
    }
    resetCall();
  };

  return (
    <CallContext.Provider value={{ startCall, joinGroupVoice, busy: Boolean(call || pending || groupVoice.session) }}>
      {children}
      {groupVoice.session && createPortal(<GroupVoicePanel voice={groupVoice} account={account} />, document.body)}
      {pending && createPortal(
        <IncomingCallOverlay
          callType={pending.callType}
          callerName={pending.callerName}
          onAccept={acceptCall}
          onDecline={declineCall}
        />,
        document.body
      )}
      {account && call && createPortal(
        <CallOverlay
          callState={callState}
          callType={call.callType}
          callerName={call.callerName}
          callerAvatar={call.callerAvatar}
          localStream={localStream}
          remoteStream={remoteStream}
          callError={signalError || callError}
          onEndCall={endCall}
          audioContextRef={audioContextRef}
        />,
        document.body
      )}
    </CallContext.Provider>
  );
}
