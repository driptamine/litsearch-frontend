import { useCallback, useEffect, useRef } from 'react';
import useWebSocket from 'core/hooks/useWebSocket';

const useChatSocket = (chatId, { onNewMessage, onTyping, onReadReceipt, onVoipCallStart, onVoipCallEnd, onVoipCallAccept, onVoipCallReject, onVoipWebRtcSignal, enabled = true } = {}) => {
  const onNewMessageRef = useRef(onNewMessage);
  const onTypingRef = useRef(onTyping);
  const onReadReceiptRef = useRef(onReadReceipt);
  const onVoipCallStartRef = useRef(onVoipCallStart);
  const onVoipCallEndRef = useRef(onVoipCallEnd);
  const onVoipCallAcceptRef = useRef(onVoipCallAccept);
  const onVoipCallRejectRef = useRef(onVoipCallReject);
  const onVoipWebRtcSignalRef = useRef(onVoipWebRtcSignal);
  const typingTimeoutRef = useRef(null);

  onNewMessageRef.current = onNewMessage;
  onTypingRef.current = onTyping;
  onReadReceiptRef.current = onReadReceipt;
  onVoipCallStartRef.current = onVoipCallStart;
  onVoipCallEndRef.current = onVoipCallEnd;
  onVoipCallAcceptRef.current = onVoipCallAccept;
  onVoipCallRejectRef.current = onVoipCallReject;
  onVoipWebRtcSignalRef.current = onVoipWebRtcSignal;

  const handleMessage = useCallback((data) => {
    switch (data.type) {
      case 'new_message':
        if (onNewMessageRef.current) onNewMessageRef.current(data.message);
        break;
      case 'typing':
        if (onTypingRef.current) onTypingRef.current(data.user_id, data.is_typing);
        break;
      case 'read_receipt':
        if (onReadReceiptRef.current) onReadReceiptRef.current(data.read_by, data.message_ids);
        break;
      case 'voip_call_start':
        if (onVoipCallStartRef.current) onVoipCallStartRef.current(data);
        break;
      case 'voip_call_end':
        if (onVoipCallEndRef.current) onVoipCallEndRef.current(data);
        break;
      case 'voip_call_accept':
        if (onVoipCallAcceptRef.current) onVoipCallAcceptRef.current(data);
        break;
      case 'voip_call_reject':
        if (onVoipCallRejectRef.current) onVoipCallRejectRef.current(data);
        break;
      case 'voip_webrtc_signal':
        if (onVoipWebRtcSignalRef.current) onVoipWebRtcSignalRef.current(data.signal_data);
        break;
    }
  }, []);

  const path = chatId ? `/ws/chat/${chatId}/` : null;
  const { send, isConnected } = useWebSocket(path, {
    onMessage: handleMessage,
    enabled: enabled && !!chatId,
  });

  const sendMessage = useCallback((text, attachments = [], voiceMessageId = null) => {
    const payload = { type: 'send_message', text, attachments };
    if (voiceMessageId != null) payload.voice_message_id = voiceMessageId;
    return send(payload);
  }, [send]);

  const sendTyping = useCallback((isTyping) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    send({ type: 'typing', is_typing: isTyping });
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        send({ type: 'typing', is_typing: false });
      }, 3000);
    }
  }, [send]);

  const sendReadReceipt = useCallback((messageIds) => {
    return send({ type: 'read_receipt', message_ids: messageIds });
  }, [send]);

  const sendVoipCallStart = useCallback((callType = 'video') => {
    return send({ type: 'voip_call_start', call_type: callType });
  }, [send]);

  const sendVoipWebRtcSignal = useCallback((signalData) => {
    return send({ type: 'voip_webrtc_signal', signal_data: signalData });
  }, [send]);

  const sendVoipCallEnd = useCallback(() => {
    return send({ type: 'voip_call_end' });
  }, [send]);

  const sendVoipCallAccept = useCallback(() => {
    return send({ type: 'voip_call_accept' });
  }, [send]);

  const sendVoipCallReject = useCallback(() => {
    return send({ type: 'voip_call_reject' });
  }, [send]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return { sendMessage, sendTyping, sendReadReceipt, sendVoipCallStart, sendVoipWebRtcSignal, sendVoipCallEnd, sendVoipCallAccept, sendVoipCallReject, isConnected };
};

export default useChatSocket;
