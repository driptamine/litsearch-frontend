import React from 'react';
import { styled } from '@linaria/react';
import appleEmojiMap from './appleEmojiMap.json';

const CDN = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple@16.0.0/img/apple/64/';

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const pattern = new RegExp(
  Object.keys(appleEmojiMap)
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|'),
  'g'
);

// Renders Apple-style emoji images instead of the OS emoji font so chat
// looks the same on every platform. Unknown sequences keep native rendering.
export function renderAppleEmojis(text) {
  if (!text || typeof text !== 'string') return text;
  pattern.lastIndex = 0;
  const out = [];
  let last = 0;
  let match;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const file = appleEmojiMap[match[0]];
    out.push(
      <EmojiImg key={key++} src={CDN + file} alt={match[0]} title={match[0]} draggable={false} loading="lazy" />
    );
    last = match.index + match[0].length;
    if (match[0].length === 0) pattern.lastIndex++;
  }
  if (last === 0) return text;
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function AppleEmoji({ char }) {
  const file = appleEmojiMap[char];
  if (!file) return <>{char}</>;
  return <EmojiImg src={CDN + file} alt={char} title={char} draggable={false} loading="lazy" />;
}

const EmojiImg = styled.img`
  width: 1.25em;
  height: 1.25em;
  vertical-align: -0.25em;
  display: inline-block;
`;

export default AppleEmoji;
