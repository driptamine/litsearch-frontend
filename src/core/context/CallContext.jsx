import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { tokenUser } from 'core/api/chatSession';
import { useNotifications } from 'core/context/NotificationContext';
import useChatSocket from 'core/hooks/useChatSocket';
import useVoip from 'core/hooks/useVoip';
import getAuthToken from 'core/utils/getAuthToken';
import CallOverlay from 'views/pages/ChatV3/Main/CallOverlay';
import IncomingCallOverlay from 'views/pages/ChatV3/Main/IncomingCallOverlay';

const CallContext = createContext(null);

export const useCalls = () => useContext(CallContext);

const disconnectedMessage = 'Chat disconnected. Close the call and try again.';

export function CallProvider({ children }) {
  const { incomingCall, closedCall, clearIncomingCall } = useNotifications();
  const accessToken = useSelector(state => state.users?.access_token) || getAuthToken();
  const account = tokenUser(accessToken);
  const [call, setCall] = useState(null);
  const [callState, setCallState] = useState('idle');
  const [readyCall, setReadyCall] = useState(null);
  const [signalError, setSignalError] = useState(null);
  const callRef = useRef(null);
  const audioContextRef = useRef(null);
  const sendSignalRef = useRef(null);
  const pending = account && !call ? incomingCall : null;
  const roomId = account ? call?.chatId ?? pending?.chatId : null;

  const sendSignal = useCallback((signal) => {
    if (!sendSignalRef.current?.(signal)) setSignalError(disconnectedMessage);
  }, []);

  const {
    localStream, remoteStream, callError, connected, createOffer,
    handleRemoteSignal, startMedia, endCall: stopMedia,
  } = useVoip({ enabled: Boolean(account), onSignal: sendSignal });

  const resetCall = useCallback(() => {
    callRef.current = null;
    stopMedia();
    const context = audioContextRef.current;
    audioContextRef.current = null;
    if (context) context.close().catch(() => {});
    setCall(null);
    setReadyCall(null);
    setSignalError(null);
    setCallState('idle');
  }, [stopMedia]);

  const handleRemoteEnd = (event) => {
    if (pending && (event.call_id == null || event.call_id === pending.id)) clearIncomingCall(pending);
    const current = callRef.current;
    if (current && (event.call_id == null || current.id == null || event.call_id === current.id)) {
      resetCall();
    }
  };

  const handleRemoteAccept = async (event) => {
    const current = callRef.current;
    if (current?.direction !== 'outgoing' || !current.signaled || current.accepted) return;
    current.id = event.call_id;
    current.accepted = true;
    setCallState('connecting');
    await createOffer();
  };

  const handleSignal = (signal) => {
    const current = callRef.current;
    if (!current?.accepted || (signal?.type === 'offer' && current.direction !== 'incoming')) return;
    return handleRemoteSignal(signal);
  };

  const {
    isConnected, sendVoipCallStart, sendVoipCallAccept, sendVoipCallReject,
    sendVoipCallEnd, sendVoipWebRtcSignal,
  } = useChatSocket(roomId, {
    onVoipCallAccept: handleRemoteAccept,
    onVoipCallEnd: handleRemoteEnd,
    onVoipCallReject: handleRemoteEnd,
    onVoipWebRtcSignal: handleSignal,
  });
  sendSignalRef.current = sendVoipWebRtcSignal;

  useEffect(() => resetCall, [account, resetCall]);

  useEffect(() => {
    if (connected && callRef.current) setCallState('connected');
  }, [connected]);

  useEffect(() => {
    if (!closedCall) return;
    if (incomingCall && incomingCall.id === closedCall.id && incomingCall.chatId === closedCall.chatId) {
      clearIncomingCall(incomingCall);
    }
    const current = callRef.current;
    if (current && current.id === closedCall.id && current.chatId === closedCall.chatId) resetCall();
  }, [closedCall, incomingCall, clearIncomingCall, resetCall]);

  useEffect(() => {
    if (!isConnected || !readyCall || readyCall !== callRef.current || readyCall.signaled) return;
    if (readyCall.direction === 'incoming') {
      readyCall.signaled = sendVoipCallAccept(readyCall.id);
      readyCall.accepted = readyCall.signaled;
    } else {
      readyCall.signaled = sendVoipCallStart(readyCall.callType);
    }
    if (!readyCall.signaled) setSignalError(disconnectedMessage);
  }, [isConnected, readyCall, sendVoipCallAccept, sendVoipCallStart]);

  const prepareCall = async (details, direction) => {
    if (callRef.current) return;
    const type = details.callType === 'video' ? 'video' : 'audio';
    const next = { ...details, callType: type, direction, signaled: false, accepted: false };
    callRef.current = next;
    setCall(next);
    setCallState(direction === 'incoming' ? 'connecting' : 'calling');

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      try {
        const context = new AudioContext();
        audioContextRef.current = context;
        context.resume().catch(() => {});
      } catch {}
    }

    if (!await startMedia(type)) return;
    if (details.delayMs) await new Promise(resolve => setTimeout(resolve, details.delayMs));
    if (callRef.current === next) setReadyCall(next);
  };

  const startCall = (details) => {
    if (account && details.chatId && !pending) prepareCall(details, 'outgoing');
  };

  const acceptCall = () => {
    if (!pending || !isConnected) return;
    prepareCall(pending, 'incoming');
    clearIncomingCall(pending);
  };

  const declineCall = () => {
    if (pending && sendVoipCallReject(pending.id)) clearIncomingCall(pending);
  };

  const endCall = () => {
    const current = callRef.current;
    if (current?.signaled) sendVoipCallEnd(current.id);
    else if (current?.direction === 'incoming') sendVoipCallReject(current.id);
    resetCall();
  };

  return (
    <CallContext.Provider value={{ startCall, busy: Boolean(call || pending) }}>
      {children}
      {pending && createPortal(
        <IncomingCallOverlay
          callType={pending.callType}
          callerName={pending.callerName}
          ready={isConnected}
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
