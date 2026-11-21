import React from 'react';
import { styled } from '@linaria/react';
import { LITLOOP_API_URL } from 'core/constants/urls';
import TrackRow from 'views/components/TrackRow';

const Attachment = styled.div`
  width: 320px;
  max-width: 100%;
  background: var(--cardColor);
  border-radius: 8px;
  overflow: hidden;
`;

export const isTrackAttachment = ({ type }) => type === 'track' || type === 'voice';

const resolveAudioUrl = (source) => {
  if (typeof source !== 'string' || !source.trim()) return '';
  try {
    const url = new URL(source, `${LITLOOP_API_URL}/`);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};

const ChatTrackAttachment = ({ attachment, index, inMessage = false }) => {
  const source = attachment.r2_url || attachment.gcs_url || attachment.url || attachment.preview_url;
  const track = { name: attachment.name, title: attachment.title, artist: attachment.artist, artists: attachment.artists, url: resolveAudioUrl(source) };
  const row = <TrackRow track={track} index={index} showNumber={!inMessage} preload={inMessage ? 'none' : 'metadata'} />;

  return inMessage ? <Attachment>{row}</Attachment> : row;
};

export default ChatTrackAttachment;
