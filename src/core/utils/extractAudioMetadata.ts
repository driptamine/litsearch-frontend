// Audio metadata extraction in the browser: duration via <audio> plus
// ID3v2.3/2.4 text frames (TIT2/TPE1/TALB) with an ID3v1 fallback.
// No dependencies; only the file head/tail is read.
const latin1 = (bytes) => {
  try {
    return new TextDecoder('windows-1252').decode(bytes);
  } catch (_) {
    return Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  }
};

const clean = (text) => (text || '').replace(/\0+$/g, '').trim();

const decodeTextFrame = (bytes) => {
  if (!bytes || bytes.length < 2) return '';
  const encoding = bytes[0];
  const body = bytes.slice(1);
  try {
    if (encoding === 0) return clean(latin1(body));
    if (encoding === 3) return clean(new TextDecoder('utf-8', { fatal: false }).decode(body));
    if (encoding === 1 || encoding === 2) {
      let data = body;
      let little = encoding === 1;
      if (encoding === 1 && data.length >= 2) {
        if (data[0] === 0xff && data[1] === 0xfe) { little = true; data = data.slice(2); }
        else if (data[0] === 0xfe && data[1] === 0xff) { little = false; data = data.slice(2); }
      }
      return clean(new TextDecoder(little ? 'utf-16le' : 'utf-16be', { fatal: false }).decode(data));
    }
  } catch (_) {}
  return '';
};

const synchsafe = (bytes, offset) => (
  ((bytes[offset] & 0x7f) << 21) |
  ((bytes[offset + 1] & 0x7f) << 14) |
  ((bytes[offset + 2] & 0x7f) << 7) |
  (bytes[offset + 3] & 0x7f)
);

const parseID3v2 = (bytes) => {
  const out = {};
  if (bytes.length < 10 || latin1(bytes.slice(0, 3)) !== 'ID3') return out;
  const version = bytes[3];
  if (version < 3 || version > 4) return out;
  const flags = bytes[5];
  if (flags & 0x80) return out; // unsynchronisation — not handled
  let offset = 10;
  if (flags & 0x40) {
    if (bytes.length < offset + 4) return out;
    const extSize = version === 4 ? synchsafe(bytes, offset) : (
      (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]
    );
    offset += 4 + extSize;
  }
  const want = { TIT2: 'title', TPE1: 'artist', TALB: 'album' };
  let guard = 0;
  while (offset + 10 <= bytes.length && guard < 64) {
    guard += 1;
    const id = latin1(bytes.slice(offset, offset + 4));
    if (!/^[A-Z0-9]{4}$/.test(id)) break;
    const size = version === 4
      ? synchsafe(bytes, offset + 4)
      : ((bytes[offset + 4] << 24) | (bytes[offset + 5] << 16) | (bytes[offset + 6] << 8) | bytes[offset + 7]);
    offset += 10;
    if (size <= 0 || offset + size > bytes.length) break;
    if (want[id] && !out[want[id]]) {
      const text = decodeTextFrame(bytes.slice(offset, offset + size));
      if (text) out[want[id]] = text;
      if (out.title && out.artist && out.album) break;
    }
    offset += size;
  }
  return out;
};

const parseID3v1 = (bytes) => {
  const out = {};
  if (bytes.length < 128) return out;
  const tail = bytes.slice(bytes.length - 128);
  if (latin1(tail.slice(0, 3)) !== 'TAG') return out;
  const title = clean(latin1(tail.slice(3, 33)));
  const artist = clean(latin1(tail.slice(33, 63)));
  const album = clean(latin1(tail.slice(63, 93)));
  if (title) out.title = title;
  if (artist) out.artist = artist;
  if (album) out.album = album;
  return out;
};

const readID3 = async (file) => {
  try {
    const head = new Uint8Array(await file.slice(0, 256 * 1024).arrayBuffer());
    const v2 = parseID3v2(head);
    if (v2.title || v2.artist) return v2;
    const tail = new Uint8Array(await file.slice(Math.max(0, file.size - 128)).arrayBuffer());
    return { ...v2, ...parseID3v1(tail) };
  } catch (_) {
    return {};
  }
};

const readDuration = (file) => new Promise((resolve) => {
  try {
    const url = URL.createObjectURL(file);
    const audio = document.createElement('audio');
    audio.preload = 'metadata';
    const done = (value) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    const timer = setTimeout(() => done(NaN), 10000);
    audio.onloadedmetadata = () => {
      clearTimeout(timer);
      done(audio.duration);
    };
    audio.onerror = () => {
      clearTimeout(timer);
      done(NaN);
    };
    audio.src = url;
  } catch (_) {
    resolve(NaN);
  }
});

export const extractAudioMetadata = async (file) => {
  const [duration, tags] = await Promise.all([readDuration(file), readID3(file)]);
  const base = (file.name || 'track').replace(/\.[^.]+$/, '').trim() || 'track';
  return {
    title: tags.title || base,
    artist: tags.artist || '',
    album: tags.album || '',
    duration: Number.isFinite(duration) ? duration : 0,
  };
};
