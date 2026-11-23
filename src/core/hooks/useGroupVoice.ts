import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as newSessionId } from 'uuid';
import { chatRequest, tokenUser } from 'core/api/chatSession';
import getAuthToken from 'core/utils/getAuthToken';
import { addCandidate } from 'core/hooks/useVoip';

export const voicePeerKey = member => `${member.user_id}:${member.session_id}`;

async function voiceCommand(session, action, payload = {}, signal) {
  const { data } = await chatRequest(`/chats/${session.chatId}/voice/`, {
    method: 'post',
    data: { action, room_id: session.roomId, session_id: session.id, ...payload },
    signal,
  });
  return data;
}

export default function useGroupVoice(account, iceServers) {
  const currentRef = useRef(null);
  const [session, setSession] = useState(null);
  const [room, setRoom] = useState(null);
  const [streams, setStreams] = useState({});
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(null);

  const closeMedia = useCallback(current => {
    current?.stream?.getTracks().forEach(track => track.stop());
    current?.peers.forEach(peer => peer.pc.close());
    current?.peers.clear();
  }, []);

  const leave = useCallback(() => {
    const current = currentRef.current;
    currentRef.current = null;
    closeMedia(current);
    setSession(null);
    setRoom(null);
    setStreams({});
    setMuted(false);
    setError(null);
    if (current?.roomId && tokenUser(getAuthToken()) === current.userId) {
      voiceCommand(current, 'leave').catch(() => {});
    }
  }, [closeMedia]);

  useEffect(() => leave, [account, leave]);

  const join = async ({ chatId, name }) => {
    if (!account || !chatId || currentRef.current) return;
    const current = { id: newSessionId(), chatId, userId: account, peers: new Map(), after: null };
    currentRef.current = current;
    setSession({ chatId, name });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (currentRef.current !== current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      current.stream = stream;
      const { room } = await voiceCommand(current, 'join');
      current.roomId = room.id;
      if (currentRef.current !== current) {
        if (tokenUser(getAuthToken()) === current.userId) voiceCommand(current, 'leave').catch(() => {});
        return;
      }
      setRoom(room);
    } catch (failure) {
      if (currentRef.current === current) {
        closeMedia(current);
        setError(failure.response?.data?.detail || failure.message || 'Could not join group voice.');
      }
    }
  };

  const toggleMute = () => {
    const track = currentRef.current?.stream?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMuted(!track.enabled);
  };

  useEffect(() => {
    const current = currentRef.current;
    if (!room?.id || current?.roomId !== room.id) return;
    const controller = new AbortController();
    let timer;

    const sendSignal = (peer, signal) => {
      if (currentRef.current !== current || current.peers.get(voicePeerKey(peer.member)) !== peer) return;
      voiceCommand(current, 'signal', {
        target_user_id: peer.member.user_id,
        target_session_id: peer.member.session_id,
        signal_data: signal,
      }).catch(failure => {
        if (failure.response?.status !== 409 && signal.type !== 'candidate' && currentRef.current === current) {
          console.warn('Could not send group voice signal', failure.message);
        }
      });
    };

    const addPeer = (member) => {
      const pc = new RTCPeerConnection({ iceServers });
      const peer = { member, pc, candidates: [] };
      const remote = new MediaStream();
      const id = voicePeerKey(member);
      current.peers.set(id, peer);
      current.stream.getTracks().forEach(track => pc.addTrack(track, current.stream));
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) sendSignal(peer, { type: 'candidate', ...candidate.toJSON() });
      };
      pc.ontrack = ({ track }) => {
        if (currentRef.current !== current || current.peers.get(id) !== peer) return;
        remote.addTrack(track);
        setStreams(previous => ({ ...previous, [id]: remote }));
      };
      if (current.userId < member.user_id) {
        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .then(() => sendSignal(peer, pc.localDescription.toJSON()))
          .catch(failure => {
            if (currentRef.current === current) console.warn('Could not start a group voice connection', failure.message);
          });
      }
    };

    const updateMembers = members => {
      const remoteMembers = members.filter(member => member.user_id !== current.userId);
      const activeIds = new Set(remoteMembers.map(voicePeerKey));
      for (const [id, peer] of current.peers) {
        if (activeIds.has(id)) continue;
        current.peers.delete(id);
        peer.pc.close();
        setStreams(previous => {
          const next = { ...previous };
          delete next[id];
          return next;
        });
      }
      for (const member of remoteMembers) {
        if (!current.peers.has(voicePeerKey(member))) addPeer(member);
      }
    };

    const receiveSignal = async frame => {
      const peer = current.peers.get(voicePeerKey({ user_id: frame.from_user_id, session_id: frame.from_session_id }));
      if (!peer) return;
      const { pc, candidates } = peer;
      const signal = frame.signal_data;
      if (signal.type === 'candidate') {
        if (pc.remoteDescription) await addCandidate(pc, signal);
        else candidates.push(signal);
        return;
      }
      if (signal.type === 'offer' ? pc.remoteDescription : pc.signalingState !== 'have-local-offer') return;
      await pc.setRemoteDescription(signal);
      for (const candidate of candidates.splice(0)) await addCandidate(pc, candidate);
      if (signal.type === 'offer') {
        await pc.setLocalDescription(await pc.createAnswer());
        sendSignal(peer, pc.localDescription.toJSON());
      }
    };

    const sync = async () => {
      try {
        const data = await voiceCommand(current, 'sync', { after: current.after }, controller.signal);
        if (controller.signal.aborted || currentRef.current !== current) return;
        updateMembers(data.room.members);
        setRoom(data.room);
        setError(null);
        for (const frame of data.signals) {
          if (controller.signal.aborted || currentRef.current !== current) return;
          try {
            await receiveSignal(frame);
          } catch (failure) {
            if (currentRef.current === current) console.warn('Could not process a group voice signal', failure.message);
          }
          current.after = frame.signal_id;
        }
      } catch (failure) {
        if (controller.signal.aborted || currentRef.current !== current) return;
        if ([403, 404, 409].includes(failure.response?.status)) {
          closeMedia(current);
          setStreams({});
          setRoom(null);
          setError('You left the voice room.');
          return;
        }
        setError('Reconnecting to group voice…');
      }
      if (!controller.signal.aborted) timer = setTimeout(sync, 900);
    };
    sync();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [room?.id, iceServers, closeMedia]);

  return { session, room, streams, muted, error, join, leave, toggleMute };
}
