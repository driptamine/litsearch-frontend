import React from 'react';
import { styled } from '@linaria/react';
import { LITLOOP_API_URL } from 'core/constants/urls';
import TrackRow, { type TrackItem } from 'views/components/TrackRow';

const Attachment = styled.div`
  width: 320px;
  max-width: 100%;
  background: var(--cardColor);
  border-radius: 8px;
  overflow: hidden;
`;

export const isTrackAttachment = ({ type }: { type?: unknown }): boolean => type === 'track' || type === 'voice';

const resolveAudioUrl = (source: unknown): string => {
  if (typeof source !== 'string' || !source.trim()) return '';
  try {
    const url = new URL(source, `${LITLOOP_API_URL}/`);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

interface ChatTrackAttachmentType {
  r2_url?: string;
  gcs_url?: string;
  url?: string;
  preview_url?: string;
  name?: string;
  title?: string;
  artist?: string;
  artists?: string[];
  [key: string]: unknown;
}

interface ChatTrackAttachmentProps {
  attachment: ChatTrackAttachmentType;
  index?: number;
  inMessage?: boolean;
}

const ChatTrackAttachment = ({ attachment, index = 0, inMessage = false }: ChatTrackAttachmentProps) => {
  const source = attachment.r2_url || attachment.gcs_url || attachment.url || attachment.preview_url;
  const track: TrackItem = { name: attachment.name, title: attachment.title, artist: attachment.artist, artists: attachment.artists, url: resolveAudioUrl(source) };
  const row = <TrackRow track={track} index={index} showNumber={!inMessage} />;

  return inMessage ? <Attachment>{row}</Attachment> : row;
};

export default ChatTrackAttachment;
