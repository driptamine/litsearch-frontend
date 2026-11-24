import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';

export interface ChatAttachment {
  url?: string;
  type?: string;
  name?: string;
  artist?: string;
  duration?: number;
  [key: string]: unknown;
}

export interface ChatQuote {
  id?: number | string;
  username?: string;
  text?: string;
  avatar?: string | null;
  [key: string]: unknown;
}

export interface ChatAttachmentDraft {
  url?: string;
  type?: string;
  name?: string;
  artist?: string;
  duration?: number;
  [key: string]: unknown;
}

export interface VoiceMessageData {
  id: number | string;
  url?: string;
  duration?: number;
  [key: string]: unknown;
}

export interface ChatMessage {
  id?: number | string | null;
  tempId?: string;
  text?: string;
  content?: string;
  body?: string;
  username?: string;
  sender_name?: string;
  avatar?: string;
  attachments?: ChatAttachment[];
  voice_message?: {
    url?: string;
    duration?: number;
    id?: number | string;
    transcription?: string;
    transcription_status?: string;
    transcription_language?: string;
    [key: string]: unknown;
  } | null;
  voice_message_id?: number | string | null;
  created_at?: string;
  is_read?: boolean;
  sentByMe?: boolean;
  isTemp?: boolean;
  reply_to?: number | string | null;
  reply_to_message?: ChatQuote | null;
  [key: string]: unknown;
}

export interface ChatAuthUser {
  username?: string;
  user?: { username?: string };
  user__username?: string;
  profileImg?: string;
  avatar?: string;
  [key: string]: unknown;
}

export type MenuOpenHandler = (
  x: number,
  y: number,
  message: ChatMessage,
  viaTouch: boolean
) => void;

export interface MessagePressHandlers {
  onTouchStart: (e: ReactTouchEvent) => void;
  onTouchMove: (e: ReactTouchEvent) => void;
  onTouchEnd: () => void;
  onTouchCancel: () => void;
  onContextMenu: (e: ReactMouseEvent) => void;
}

export interface MessageBubbleProps {
  message: ChatMessage;
  formatTime: (ts?: string) => string;
  quote?: ChatQuote | null;
  flash?: boolean;
  onReply?: () => void;
  onQuoteClick?: (quotedId: number | string | null | undefined) => void;
  onMenu?: MenuOpenHandler;
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export interface MyMessageProps extends MessageBubbleProps {
  authUser?: ChatAuthUser | null;
}
