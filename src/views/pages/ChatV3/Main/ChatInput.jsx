import React, { useState, useCallback, useRef, useEffect } from 'react';
import { styled } from '@linaria/react';
import { useSelector } from 'react-redux';
import { IoSend, IoAdd } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';
import { FaImage, FaFilm, FaMusic, FaFileUpload, FaMicrophone, FaStop, FaTrash } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader, uploadVoiceMessage } from 'core/api/rest-helper';
import axios from 'axios';
import useMediaRecorder from 'core/hooks/useMediaRecorder';
import PhotoPickerModal from 'views/components/upload/uploader/posts/PhotoPickerModal';
import VideoPickerModal from 'views/components/upload/uploader/posts/VideoPickerModal';
import TrackPickerModal from 'views/components/upload/uploader/posts/TrackPickerModal';

const resolveUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${LITLOOP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const ChatInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [picker, setPicker] = useState(null);
  const [voiceUploading, setVoiceUploading] = useState(false);
  const [voiceMessageData, setVoiceMessageData] = useState(null);
  const typingTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);
  const username = useSelector((state) => state.users?.username);

  const { state: recState, duration, blob, startRecording, stopRecording, cancelRecording, reset } = useMediaRecorder();

  const uploadFiles = useCallback(async (files) => {
    setUploading(true);
    const newAttachments = [];
    let uploadError = null;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post(`${LITLOOP_API_URL}/chats/upload/`, formData, {
          headers: { ...authHeader() },
          withCredentials: true,
        });
        newAttachments.push({
          url: res.data.url,
          type: res.data.type,
          name: res.data.name,
        });
      } catch (err) {
        uploadError = err.response?.data?.error || err.message;
        console.error('Failed to upload attachment:', err);
      }
    }

    if (uploadError) {
      alert('Upload failed: ' + uploadError);
    }
    if (newAttachments.length) {
      setAttachments((prev) => [...prev, ...newAttachments]);
    }
    setUploading(false);
  }, []);

  const handleSend = useCallback(() => {
    if ((message.trim() || attachments.length > 0 || voiceMessageData) && !uploading && !voiceUploading) {
      onSendMessage(message, attachments, voiceMessageData);
      setMessage('');
      setAttachments([]);
      setVoiceMessageData(null);
      if (onTyping) onTyping(false);
    }
  }, [message, attachments, uploading, voiceUploading, voiceMessageData, onSendMessage, onTyping]);

  const handleChange = useCallback((e) => {
    setMessage(e.target.value);
    if (onTyping) {
      onTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  }, [onTyping]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleAttachClick = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  const pickerAction = useCallback(async (pickerType) => {
    setShowDropdown(false);
    if (pickerType === 'file') {
      fileInputRef.current?.click();
      return;
    }
    setPicker(pickerType);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = e.target.files;
    if (!files?.length) return;
    uploadFiles(Array.from(files));
    e.target.value = '';
  }, [uploadFiles]);

  const removeAttachment = useCallback((index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    uploadFiles(files);
  }, [uploadFiles]);

  const handlePhotoSelect = useCallback(async (ids) => {
    setPicker(null);
    if (!ids?.length) return;
    try {
      const res = await axios.get(`${LITLOOP_API_URL}/users/${username}/photos/`, { headers: authHeader() });
      const data = res.data;
      const photos = data.results || data.photos || data;
      if (!Array.isArray(photos)) return;
      const selected = photos.filter((p) => ids.includes(p.id || p.pk));
      const newAtt = selected.map((p) => ({
        url: p.gcs_url || p.image || p.url || p.file_path,
        type: 'photo',
        name: p.name || p.title || 'photo',
      }));
      if (newAtt.length) setAttachments((prev) => [...prev, ...newAtt]);
    } catch (err) {
      console.error('Failed to add photos:', err);
    }
  }, [username]);

  const handleVideoSelect = useCallback(async (ids) => {
    setPicker(null);
    if (!ids?.length) return;
    try {
      const res = await axios.get(`${LITLOOP_API_URL}/users/${username}/videos/`, { headers: authHeader() });
      const data = res.data;
      const videos = data.results || data.videos || data;
      if (!Array.isArray(videos)) return;
      const selected = videos.filter((v) => ids.includes(v.id || v.pk || v.video_id));
      const newAtt = selected.map((v) => ({
        url: v.gcs_url || v.url || v.file || v.file_path,
        type: 'video',
        name: v.title || v.name || 'video',
      }));
      if (newAtt.length) setAttachments((prev) => [...prev, ...newAtt]);
    } catch (err) {
      console.error('Failed to add videos:', err);
    }
  }, [username]);

  const handleTrackSelect = useCallback((tracks) => {
    setPicker(null);
    if (!tracks?.length) return;
    const newAtt = tracks.map((t) => ({
      url: t.gcs_url || t.url || t.preview_url,
      type: 'track',
      name: t.name || 'track',
    }));
    if (newAtt.length) setAttachments((prev) => [...prev, ...newAtt]);
  }, []);

  const handleStartRecording = useCallback(() => {
    startRecording();
  }, [startRecording]);

  const handleStopRecording = useCallback(async () => {
    stopRecording();
  }, [stopRecording]);

  const handleCancelRecording = useCallback(() => {
    cancelRecording();
    setVoiceMessageData(null);
  }, [cancelRecording]);

  const handleDiscardVoice = useCallback(() => {
    reset();
    setVoiceMessageData(null);
  }, [reset]);

  useEffect(() => {
    if (recState === 'stopped' && blob) {
      const upload = async () => {
        setVoiceUploading(true);
        try {
          const data = await uploadVoiceMessage(blob, duration);
          const voiceData = { id: data.id, url: data.url, duration: data.duration };
          setVoiceMessageData(voiceData);
          try {
            const raw = sessionStorage.getItem('voice_cache');
            const cache = raw ? JSON.parse(raw) : {};
            cache[data.id] = voiceData;
            sessionStorage.setItem('voice_cache', JSON.stringify(cache));
          } catch (_) {}
        } catch (err) {
          console.error('Voice upload failed:', err.response?.data || err.message, err);
          alert('Failed to upload voice message: ' + (err.response?.data?.error || err.response?.data?.detail || err.message));
        } finally {
          setVoiceUploading(false);
        }
      };
      upload();
    }
  }, [recState, blob, duration]);

  return (
    <ChatInputContainer
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <DropOverlay>
          <DropIcon>
            <IoAdd size={48} />
          </DropIcon>
          <DropText>Drop files here</DropText>
        </DropOverlay>
      )}
      <AttachmentsPreview>
        {attachments.map((att, idx) => (
          <AttachmentChip key={idx}>
            {att.type === 'photo' && <ThumbPreview src={resolveUrl(att.url)} alt={att.name} />}
            {att.type === 'video' && <FileIcon>V</FileIcon>}
            {att.type === 'track' && <FileIcon>A</FileIcon>}
            <AttachmentName>{att.name}</AttachmentName>
            <RemoveAttBtn onClick={() => removeAttachment(idx)}>
              <IoClose size={14} />
            </RemoveAttBtn>
          </AttachmentChip>
        ))}
        {uploading && <UploadingLabel>Uploading...</UploadingLabel>}
      </AttachmentsPreview>
      <InputRow>
        <AttachWrapper>
          <AttachButton onClick={handleAttachClick} disabled={uploading}>
            <IoAdd size={22} />
          </AttachButton>
          {showDropdown && (
            <>
              <DropdownBackdrop onClick={() => setShowDropdown(false)} />
              <Dropdown>
                <DropItem onClick={() => pickerAction('photo')}>
                  <FaImage /> Photos
                </DropItem>
                <DropItem onClick={() => pickerAction('video')}>
                  <FaFilm /> Videos
                </DropItem>
                <DropItem onClick={() => pickerAction('track')}>
                  <FaMusic /> Tracks
                </DropItem>
                <DropItem onClick={() => pickerAction('file')}>
                  <FaFileUpload /> Upload File
                </DropItem>
              </Dropdown>
            </>
          )}
        </AttachWrapper>
        <Input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        {recState === 'idle' && !voiceMessageData && (
          <VoiceButton onClick={handleStartRecording} disabled={uploading || voiceUploading} title="Record voice message">
            <FaMicrophone size={16} />
          </VoiceButton>
        )}
        {recState === 'recording' && (
          <RecordBar>
            <RecordDot />
            <RecordTimer>{formatDuration(duration)}</RecordTimer>
            <VoiceBtn onClick={handleStopRecording} title="Stop recording">
              <FaStop size={16} />
            </VoiceBtn>
          </RecordBar>
        )}
        {recState === 'stopped' && blob && (
          <RecordBar>
            <span style={{ color: '#ccc', fontSize: 13 }}>{formatDuration(duration)}</span>
            <VoiceBtn onClick={handleDiscardVoice} title="Discard">
              <FaTrash size={14} color="#ff4444" />
            </VoiceBtn>
            <VoiceBtn onClick={() => handleStartRecording()} title="Re-record" style={{ fontSize: 12, color: '#009688' }}>
              Re-record
            </VoiceBtn>
          </RecordBar>
        )}
        {voiceMessageData && !voiceUploading && (
          <span style={{ color: '#009688', fontSize: 12, marginRight: 4 }}>
            Voice ready
          </span>
        )}
        {voiceMessageData && !voiceUploading && (
          <VoiceBtn onClick={handleDiscardVoice} title="Discard voice" style={{ marginRight: 8 }}>
            <FaTrash size={12} color="#ff4444" />
          </VoiceBtn>
        )}
        {voiceUploading && (
          <span style={{ color: '#888', fontSize: 12, marginRight: 8 }}>
            Uploading...
          </span>
        )}
        <SendButton onClick={handleSend} disabled={(!message.trim() && !attachments.length && !voiceMessageData) || uploading || voiceUploading}>
          <IoSend size={20} />
        </SendButton>
      </InputRow>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {picker === 'photo' && (
        <PhotoPickerModal
          onSelect={handlePhotoSelect}
          onClose={() => setPicker(null)}
        />
      )}
      {picker === 'video' && (
        <VideoPickerModal
          onSelect={handleVideoSelect}
          onClose={() => setPicker(null)}
        />
      )}
      {picker === 'track' && (
        <TrackPickerModal
          onSelect={handleTrackSelect}
          onClose={() => setPicker(null)}
        />
      )}
    </ChatInputContainer>
  );
};

const formatDuration = (sec) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const ChatInputContainer = styled.div`
  position: relative;
  padding: 8px 16px 12px;
  border-top: 1px solid #434343;
  background-color: #1a1a1a;
  border-radius: 0 0 10px 10px;
`;

const DropOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 150, 136, 0.15);
  backdrop-filter: blur(4px);
  border-radius: 0 0 10px 10px;
  z-index: 10;
`;

const DropIcon = styled.div`
  color: #009688;
  transform: rotate(45deg);
`;

const DropText = styled.span`
  color: #009688;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
`;

const AttachmentsPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
`;

const AttachmentChip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #333;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  color: #ccc;
`;

const ThumbPreview = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  object-fit: cover;
`;

const FileIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
`;

const AttachmentName = styled.span`
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveAttBtn = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  &:hover {
    color: #ff4444;
  }
`;

const UploadingLabel = styled.span`
  font-size: 12px;
  color: #888;
  font-style: italic;
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
`;

const AttachWrapper = styled.div`
  position: relative;
  margin-right: 8px;
`;

const DropdownBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 19;
`;

const Dropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 6px;
  z-index: 20;
  min-width: 160px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
`;

const DropItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  color: #ddd;
  cursor: pointer;
  font-size: 14px;
  border-radius: 6px;
  text-align: left;
  &:hover {
    background: #3a3a3a;
    color: #fff;
  }
`;

const Input = styled.input`
  color: white;
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #333;
  border-radius: 24px;
  font-size: 15px;
  outline: none;
  background-color: #2a2a2a;
  transition: border-color 0.2s;

  &:focus {
    border-color: #009688;
  }

  &::placeholder {
    color: #888;
  }
`;

const AttachButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: ${({ active }) => (active ? '#444' : '#333')};
  color: ${({ active }) => (active ? '#fff' : '#aaa')};
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #444;
    color: #fff;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const VoiceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #e91e63;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  margin-right: 8px;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #c2185b;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const RecordBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 8px;
`;

const RecordDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff4444;
  animation: pulse 1s infinite;
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const RecordTimer = styled.span`
  color: #ff4444;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const VoiceBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 4px;
  &:hover { color: #fff; }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-left: 12px;
  border: none;
  border-radius: 50%;
  background-color: #009688;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #00796b;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background-color: #444;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default ChatInput;
