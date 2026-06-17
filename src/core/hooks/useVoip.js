import { useState, useRef, useCallback, useEffect } from 'react';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const useVoip = ({ onSignal, callType }) => {
  const [iceServers, setIceServers] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [mediaError, setMediaError] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  useEffect(() => {
    const fetchIceServers = async () => {
      try {
        const res = await fetch(`${LITLOOP_API_URL}/chats/ice_servers/`, {
          headers: { ...authHeader() },
        });
        const data = await res.json();
        const servers = Array.isArray(data) ? data : data.iceServers || data.ice_servers || [];
        setIceServers(servers);
      } catch (err) {
        console.error('Failed to fetch ICE servers:', err);
        setIceServers([{ urls: 'stun:stun.l.google.com:19302' }]);
      }
    };
    fetchIceServers();
  }, []);

  const startMedia = useCallback(async (type) => {
    try {
      const constraints = {
        audio: true,
        video: type === 'video',
      };
      console.log('[useVoip] startMedia', type, constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('[useVoip] got stream, audio tracks:', stream.getAudioTracks().length, 'video tracks:', stream.getVideoTracks().length);
      localStreamRef.current = stream;
      setLocalStream(stream);
      setMediaError(null);
      return stream;
    } catch (err) {
      console.error('[useVoip] getUserMedia error:', err);
      setMediaError(err.message || 'Media access denied');
      return null;
    }
  }, []);

  const stopMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setMediaError(null);
    setConnecting(false);
    setConnected(false);
  }, []);

  const cleanupPeerConnection = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    pendingCandidatesRef.current = [];
  }, []);

  const createPeerConnection = useCallback((stream) => {
    if (pcRef.current) {
      pcRef.current.close();
    }

    const config = {
      iceServers: iceServers.length > 0 ? iceServers : [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    const pc = new RTCPeerConnection(config);
    pcRef.current = pc;
    setConnecting(true);

    if (stream) {
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        onSignal({
          type: 'candidate',
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        });
      }
    };

    pc.ontrack = (event) => {
      console.log('[useVoip] ontrack fired', {
        trackKind: event.track?.kind,
        streamId: event.streams[0]?.id,
        audioTracks: event.streams[0]?.getAudioTracks().length,
        videoTracks: event.streams[0]?.getVideoTracks().length,
      });
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      console.log('[useVoip] connectionState:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setConnected(true);
        setConnecting(false);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnected(false);
        setConnecting(false);
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[useVoip] iceConnectionState:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
        setConnected(false);
        setConnecting(false);
      }
    };

    return pc;
  }, [iceServers, onSignal]);

  const createOffer = useCallback(async () => {
    if (pcRef.current) {
      console.log('[useVoip] createOffer skipped - pc already exists');
      return null;
    }

    const stream = localStreamRef.current || await startMedia(callType);
    if (!stream) {
      console.log('[useVoip] createOffer failed - no stream');
      return null;
    }

    console.log('[useVoip] creating offer, stream audio tracks:', stream.getAudioTracks().length);

    const pc = createPeerConnection(stream);
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log('[useVoip] offer created');
      return offer;
    } catch (err) {
      console.error('[useVoip] Failed to create offer:', err);
      return null;
    }
  }, [callType, startMedia, createPeerConnection]);

  const handleRemoteSignal = useCallback(async (signalData) => {
    console.log('[useVoip] handleRemoteSignal', signalData.type, signalData.type === 'offer' ? '(offer)' : signalData.type === 'answer' ? '(answer)' : signalData.candidate ? '(candidate)' : '');

    if (signalData.type === 'offer' && signalData.sdp) {
      if (!pcRef.current) {
        const stream = localStreamRef.current;
        if (!stream) {
          console.log('[useVoip] handleRemoteSignal: no local stream for offer');
          return null;
        }
        console.log('[useVoip] creating PC for incoming offer, stream audio tracks:', stream.getAudioTracks().length);
        createPeerConnection(stream);
      }

      const pc = pcRef.current;
      if (!pc) return null;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: signalData.sdp }));
        console.log('[useVoip] set remote description (offer), pending candidates:', pendingCandidatesRef.current.length);
        for (const c of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        }
        pendingCandidatesRef.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log('[useVoip] created and sent answer');
        onSignal({ type: 'answer', sdp: answer.sdp });
        return answer;
      } catch (err) {
        console.error('[useVoip] Failed to handle remote offer:', err);
        return null;
      }
    }

    const pc = pcRef.current;
    if (!pc) {
      console.log('[useVoip] handleRemoteSignal: no PC for', signalData.type, signalData.candidate ? '(candidate)' : '');
      return null;
    }

    if (signalData.type === 'answer' && signalData.sdp) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: signalData.sdp }));
        console.log('[useVoip] set remote description (answer), pending candidates:', pendingCandidatesRef.current.length);
        for (const c of pendingCandidatesRef.current) {
          await pc.addIceCandidate(new RTCIceCandidate(c));
        }
        pendingCandidatesRef.current = [];
      } catch (err) {
        console.error('[useVoip] Failed to set remote answer:', err);
      }
    } else if (signalData.candidate) {
      if (pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(signalData));
        } catch (err) {
          console.error('[useVoip] Failed to add ICE candidate:', err);
        }
      } else {
        console.log('[useVoip] queuing candidate, no remote desc yet');
        pendingCandidatesRef.current.push(signalData);
      }
    }
  }, [createPeerConnection, onSignal]);

  const startCall = useCallback(async () => {
    await startMedia(callType);
  }, [callType, startMedia]);

  const acceptCall = useCallback(async () => {
    await startMedia(callType);
  }, [callType, startMedia]);

  const endCall = useCallback(() => {
    cleanupPeerConnection();
    stopMedia();
  }, [cleanupPeerConnection, stopMedia]);

  return {
    localStream,
    remoteStream,
    mediaError,
    connecting,
    connected,
    createOffer,
    handleRemoteSignal,
    startCall,
    acceptCall,
    endCall,
    startMedia,
    stopMedia,
    cleanupPeerConnection,
  };
};

export default useVoip;
