import { useCallback, useEffect, useRef } from 'react';
import useWebSocket from 'core/hooks/useWebSocket';
import { tokenUser } from 'core/api/chatSession';
import getAuthToken from 'core/utils/getAuthToken';

export interface ChatSocketMessage {
  id?: number;
  chat_id?: number;
  user_id?: number;
  username?: string;
  [key: string]: unknown;
}

interface VoipSignalData {
  signal_data?: unknown;
  [key: string]: unknown;
}

interface UseChatSocketOptions {
  onNewMessage?: (message: ChatSocketMessage) => void;
  onTyping?: (userId: number, isTyping: boolean, username?: string) => void;
  onReadReceipt?: (readBy: number, messageIds: number[]) => void;
  onVoipCallStart?: (data: Record<string, unknown>) => void;
  onVoipCallEnd?: (data: Record<string, unknown>) => void;
  onVoipCallAccept?: (data: Record<string, unknown>) => void;
  onVoipCallReject?: (data: Record<string, unknown>) => void;
  onVoipWebRtcSignal?: (signalData: unknown, data: VoipSignalData) => void;
  enabled?: boolean;
}

type OutgoingPayload = Record<string, unknown>;

const useChatSocket = (chatId: string | number | null, { onNewMessage, onTyping, onReadReceipt, onVoipCallStart, onVoipCallEnd, onVoipCallAccept, onVoipCallReject, onVoipWebRtcSignal, enabled = true }: UseChatSocketOptions = {}) => {
  const onNewMessageRef = useRef(onNewMessage);
  const onTypingRef = useRef(onTyping);
  const onReadReceiptRef = useRef(onReadReceipt);
  const onVoipCallStartRef = useRef(onVoipCallStart);
  const onVoipCallEndRef = useRef(onVoipCallEnd);
  const onVoipCallAcceptRef = useRef(onVoipCallAccept);
  const onVoipCallRejectRef = useRef(onVoipCallReject);
  const onVoipWebRtcSignalRef = useRef(onVoipWebRtcSignal);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  onNewMessageRef.current = onNewMessage;
  onTypingRef.current = onTyping;
  onReadReceiptRef.current = onReadReceipt;
  onVoipCallStartRef.current = onVoipCallStart;
  onVoipCallEndRef.current = onVoipCallEnd;
  onVoipCallAcceptRef.current = onVoipCallAccept;
  onVoipCallRejectRef.current = onVoipCallReject;
  onVoipWebRtcSignalRef.current = onVoipWebRtcSignal;

  const handleMessage = useCallback((data: unknown) => {
    const msg = data as Record<string, unknown>;
    if (typeof msg?.type !== 'string') return;
    if (msg.type.startsWith('voip_') && msg.from_user_id != null &&
        String(msg.from_user_id) === String(tokenUser(getAuthToken()))) return;

    switch (msg.type) {
      case 'new_message':
        if (onNewMessageRef.current) onNewMessageRef.current(msg.message as ChatSocketMessage);
        break;
      case 'typing':
        if (onTypingRef.current) onTypingRef.current(msg.user_id as number, msg.is_typing as boolean, msg.username as string | undefined);
        break;
      case 'read_receipt':
        if (onReadReceiptRef.current) onReadReceiptRef.current(msg.read_by as number, msg.message_ids as number[]);
        break;
      case 'voip_call_start':
        if (onVoipCallStartRef.current) onVoipCallStartRef.current(msg as Record<string, unknown>);
        break;
      case 'voip_call_end':
        if (onVoipCallEndRef.current) onVoipCallEndRef.current(msg as Record<string, unknown>);
        break;
      case 'voip_call_accept':
        if (onVoipCallAcceptRef.current) onVoipCallAcceptRef.current(msg as Record<string, unknown>);
        break;
      case 'voip_call_reject':
        if (onVoipCallRejectRef.current) onVoipCallRejectRef.current(msg as Record<string, unknown>);
        break;
      case 'voip_webrtc_signal':
        if (onVoipWebRtcSignalRef.current) onVoipWebRtcSignalRef.current(msg.signal_data, msg as VoipSignalData);
        break;
    }
  }, []);

  const path = chatId ? `/ws/chat/${chatId}/` : null;
  const { send, isConnected } = useWebSocket(path, {
    onMessage: handleMessage,
    enabled: enabled && !!chatId,
    requireAuth: true,
  });

  const sendMessage = useCallback((text: string, attachments: unknown[] = [], voiceMessageId: number | string | null = null, replyToId: number | string | null = null) => {
    const payload: OutgoingPayload = { type: 'send_message', text, attachments };
    if (voiceMessageId != null) payload.voice_message_id = voiceMessageId;
    if (replyToId != null) payload.reply_to = replyToId;
    return send(payload);
  }, [send]);

  const sendTyping = useCallback((isTyping: boolean) => {
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

  const sendReadReceipt = useCallback((messageIds: number[]) => {
    return send({ type: 'read_receipt', message_ids: messageIds });
  }, [send]);

  const sendVoipCallStart = useCallback((callType = 'video') => {
    return send({ type: 'voip_call_start', call_type: callType });
  }, [send]);

  const sendVoipWebRtcSignal = useCallback((signalData: unknown) => {
    return send({ type: 'voip_webrtc_signal', signal_data: signalData });
  }, [send]);

  const sendVoipCallEnd = useCallback((callId: string | number) => {
    return send({ type: 'voip_call_end', call_id: callId });
  }, [send]);

  const sendVoipCallAccept = useCallback((callId: string | number) => {
    return send({ type: 'voip_call_accept', call_id: callId });
  }, [send]);

  const sendVoipCallReject = useCallback((callId: string | number) => {
    return send({ type: 'voip_call_reject', call_id: callId });
  }, [send]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return { sendMessage, sendTyping, sendReadReceipt, sendVoipCallStart, sendVoipWebRtcSignal, sendVoipCallEnd, sendVoipCallAccept, sendVoipCallReject, isConnected };
};

export default useChatSocket;
