import React, { useState, useCallback, useRef } from 'react';
import { styled } from '@linaria/react';
import { FaUpload, FaMusic } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import { useMediaUpload } from './useMediaUpload';

function UploadTrackModal({ onClose, onUploadComplete }) {
  const [uploadedTracks, setUploadedTracks] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);
  const { uploadFiles, isUploading, progress } = useMediaUpload();

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragOver(true);
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

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
    if (!files.length) return;
    await uploadAndTrack(files);
  }, []);

  const handleFileSelect = useCallback(async (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('audio/'));
    e.target.value = '';
    if (!files.length) return;
    await uploadAndTrack(files);
  }, []);

  const uploadAndTrack = async (files) => {
    const results = await uploadFiles(files, 'track');
    const newTracks = results.filter(r => r.id || r.pk || r.uri);
    if (newTracks.length) {
      setUploadedTracks(prev => [...prev, ...newTracks]);
      if (onUploadComplete) onUploadComplete(newTracks);
    }
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal
        onClick={e => e.stopPropagation()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Header>
          Upload Tracks
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          style={{
            position: 'absolute',
            opacity: 0,
            width: '0.1px',
            height: '0.1px',
            pointerEvents: 'none',
          }}
          onChange={handleFileSelect}
        />
        <Body>
          <DropZone
            isDragOver={isDragOver}
            isUploading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <UploadProgress progress={progress} />
            ) : uploadedTracks.length > 0 ? (
              <UploadedListComponent tracks={uploadedTracks} />
            ) : (
              <DropContent>
                <DropIcon><FaMusic size={48} /></DropIcon>
                <DropTitle>Drop audio files here</DropTitle>
                <DropSubtitle>or click to browse</DropSubtitle>
                <DropHint>Supports: MP3, WAV, FLAC, M4A, OGG</DropHint>
              </DropContent>
            )}
          </DropZone>
        </Body>
        <Footer>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <DoneBtn onClick={handleDone} disabled={uploadedTracks.length === 0 && !isUploading}>
            {uploadedTracks.length > 0 ? `Done (${uploadedTracks.length} uploaded)` : 'Done'}
          </DoneBtn>
        </Footer>
      </Modal>
    </Overlay>
  );
}

const UploadProgress = ({ progress }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
    <UploadingIcon><FaUpload size={32} /></UploadingIcon>
    <ProgressLabel>Uploading tracks... {progress}%</ProgressLabel>
    <ProgressTrack>
      <ProgressFill style={{ width: `${progress}%` }} />
    </ProgressTrack>
  </div>
);

const UploadedListComponent = ({ tracks }) => (
  <div style={{ width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
    {tracks.map((track, i) => (
      <UploadedTrack key={track.id || track.pk || track.uri || i}>
        <TrackInfo>
          <TrackName>{track.name || track.title || `Track ${i + 1}`}</TrackName>
          {track.artist && <TrackArtist>{track.artist}</TrackArtist>}
        </TrackInfo>
        <TrackStatus>✓ Uploaded</TrackStatus>
      </UploadedTrack>
    ))}
  </div>
);

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Modal = styled.div`
  background: #1a1a1a;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  border: 1px solid #333;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid #333;
`;

const CloseBtn = styled.button`
  background: none; border: none; color: #888;
  font-size: 1.5rem; cursor: pointer; padding: 0; line-height: 1;
  &:hover { color: white; }
`;

const Body = styled.div`
  padding: 0;
  overflow: hidden;
  flex: 1;
  position: relative;
`;

const Footer = styled.div`
  display: flex; gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #333;
`;

const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 40px 20px;
  border: 2px dashed ${({ isDragOver }) => (isDragOver ? '#009688' : '#444')};
  border-radius: 12px;
  margin: 20px;
  background: ${({ isDragOver }) => (isDragOver ? 'rgba(0, 150, 136, 0.1)' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;
`;

const DropContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
`;

const DropIcon = styled.div`
  color: ${({ isDragOver }) => (isDragOver ? '#009688' : '#666')};
  transition: color 0.2s;
`;

const DropTitle = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
`;

const DropSubtitle = styled.div`
  color: #aaa;
  font-size: 0.95rem;
`;

const DropHint = styled.div`
  color: #666;
  font-size: 0.8rem;
  margin-top: 8px;
`;

const UploadingIcon = styled.div`
  color: #009688;
  animation: spin 1s linear infinite;
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const ProgressLabel = styled.div`
  color: #aaa;
  font-size: 0.95rem;
  text-align: center;
`;

const ProgressTrack = styled.div`
  width: 80%;
  max-width: 300px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #009688;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const UploadedTrack = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #222;
  border-radius: 8px;
  border: 1px solid #333;
`;

const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const TrackName = styled.div`
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackArtist = styled.div`
  color: #888;
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackStatus = styled.div`
  color: #009688;
  font-size: 0.8rem;
  font-weight: 600;
`;

const CancelBtn = styled.button`
  flex: 1; padding: 10px;
  background: transparent; color: #aaa;
  border: 1px solid #444; border-radius: 8px;
  font-size: 0.95rem; cursor: pointer;
  &:hover { background: #222; }
`;

const DoneBtn = styled.button`
  flex: 1; padding: 10px;
  background: #0084ff; color: white;
  border: none; border-radius: 8px;
  font-size: 0.95rem; font-weight: 600; cursor: pointer;
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #0073e6; }
`;

export default UploadTrackModal;