import { useState, useRef, useCallback, useEffect } from 'react';
import { chatRequest } from 'core/api/chatSession';

const defaultIceServers = [{ urls: 'stun:stun.l.google.com:19302' }];

export async function addCandidate(pc, candidate) {
  try {
    await pc.addIceCandidate(candidate);
  } catch (error) {
    console.warn('Failed to add call ICE candidate:', error);
  }
}

const useVoip = ({ enabled, onSignal }) => {
  const [iceServers, setIceServers] = useState(defaultIceServers);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callError, setCallError] = useState(null);
  const [connected, setConnected] = useState(false);
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const mediaRequestRef = useRef(0);
  const pendingCandidatesRef = useRef([]);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    chatRequest('/chats/ice_servers/', { signal: controller.signal })
      .then(({ data }) => {
        const servers = Array.isArray(data) ? data : data?.iceServers || data?.ice_servers;
        if (servers?.length) setIceServers(servers);
      })
      .catch(error => {
        if (!controller.signal.aborted) console.warn('Failed to fetch call ICE servers:', error);
      });
    return () => controller.abort();
  }, [enabled]);

  const startMedia = useCallback(async (type) => {
    setCallError(null);
    const request = ++mediaRequestRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === 'video' });
      if (request !== mediaRequestRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return false;
      }
      localStreamRef.current = stream;
      setLocalStream(stream);
      return true;
    } catch (error) {
      if (request === mediaRequestRef.current) {
        setCallError(error.message || 'Could not access your microphone.');
      }
      return false;
    }
  }, []);

  const endCall = useCallback(() => {
    mediaRequestRef.current++;
    const pc = pcRef.current;
    pcRef.current = null;
    pc?.close();
    pendingCandidatesRef.current = [];
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;
    setLocalStream(null);
    setRemoteStream(null);
    setCallError(null);
    setConnected(false);
  }, []);

  const createPeerConnection = useCallback((stream) => {
    const pc = new RTCPeerConnection({ iceServers });
    pcRef.current = pc;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.onicecandidate = ({ candidate }) => {
      if (candidate && pcRef.current === pc) {
        onSignal({ type: 'candidate', ...candidate.toJSON() });
      }
    };

    const remote = new MediaStream();
    pc.ontrack = ({ track, streams }) => {
      if (pcRef.current !== pc) return;
      if (!streams.length) remote.addTrack(track);
      setRemoteStream(streams[0] || remote);
    };

    pc.onconnectionstatechange = () => {
      if (pcRef.current !== pc) return;
      setConnected(pc.connectionState === 'connected');
      if (pc.connectionState === 'failed') {
        setCallError('Could not establish a call connection.');
      }
    };

    return pc;
  }, [iceServers, onSignal]);

  const createOffer = useCallback(async () => {
    const stream = localStreamRef.current;
    if (!stream || pcRef.current) return;
    try {
      const pc = createPeerConnection(stream);
      await pc.setLocalDescription(await pc.createOffer());
      if (pcRef.current === pc) onSignal(pc.localDescription.toJSON());
    } catch (error) {
      if (localStreamRef.current === stream) setCallError('Could not start the call connection.');
      console.warn('Failed to create call offer:', error);
    }
  }, [createPeerConnection, onSignal]);

  const handleRemoteSignal = useCallback(async (signal) => {
    const stream = localStreamRef.current;
    if (!stream || !signal) return;
    let pc = pcRef.current;
    if (signal.type === 'candidate' && signal.candidate) {
      if (!pc?.remoteDescription) pendingCandidatesRef.current.push(signal);
      else await addCandidate(pc, signal);
      return;
    }

    const isOffer = signal.type === 'offer';
    if (!signal.sdp) return;
    if (isOffer && pc) return;
    if (!isOffer && (signal.type !== 'answer' || pc?.signalingState !== 'have-local-offer')) return;

    try {
      if (isOffer) pc = createPeerConnection(stream);
      await pc.setRemoteDescription({ type: signal.type, sdp: signal.sdp });
      if (pcRef.current !== pc) return;

      const candidates = pendingCandidatesRef.current;
      pendingCandidatesRef.current = [];
      for (const candidate of candidates) await addCandidate(pc, candidate);

      if (isOffer && pcRef.current === pc) {
        await pc.setLocalDescription(await pc.createAnswer());
        if (pcRef.current === pc) onSignal(pc.localDescription.toJSON());
      }
    } catch (error) {
      if (localStreamRef.current === stream) setCallError('Could not negotiate the call connection.');
      console.warn('Failed to process call signal:', error);
    }
  }, [createPeerConnection, onSignal]);

  return { iceServers, localStream, remoteStream, callError, connected, createOffer, handleRemoteSignal, startMedia, endCall };
};

export default useVoip;
