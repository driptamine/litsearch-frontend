import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

function TrackEditModal({ track, onClose, onUpdated, onDeleted }) {
  const trackUri = track.pk || track.uri || track.id || track.track_uri || track.isrc;
  const [loading, setLoading] = useState(!!trackUri);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState(track.name || '');
  const [artists, setArtists] = useState(
    Array.isArray(track.artists) ? track.artists.map(a => a.name || a).join(', ') : ''
  );

  useEffect(() => {
    const fetchDetail = async () => {
      if (!trackUri) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          `${LITLOOP_API_URL}/tracks/${trackUri}/`,
          { headers: authHeader() }
        );
        const data = res.data;
        setName(data.name || name);
        if (Array.isArray(data.artists)) {
          setArtists(data.artists.map(a => a.name || a).join(', '));
        }
      } catch (err) {
        console.error('Error fetching track detail:', err);
        setError('Failed to load track details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [trackUri]);

  const handleSave = async () => {
    if (!trackUri) {
      setError('Track has no identifier (uri/id). Cannot update.');
      return;
    }
    setSaving(true);
    setError(null);
    const artistsArray = artists
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    try {
      await axios.put(
        `${LITLOOP_API_URL}/tracks/${trackUri}/upd/`,
        { name, artists: artistsArray },
        { headers: authHeader() }
      );
      onUpdated?.({ ...track, name, artists: artistsArray });
      onClose();
    } catch (err) {
      console.error('Error updating track:', err);
      setError('Failed to update track.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!trackUri) {
      setError('Track has no identifier (uri/id). Cannot delete.');
      return;
    }
    if (!window.confirm('Delete this track?')) return;
    try {
      await axios.delete(
        `${LITLOOP_API_URL}/tracks/${trackUri}/del/`,
        { headers: authHeader() }
      );
      onDeleted?.(trackUri);
      onClose();
    } catch (err) {
      console.error('Error deleting track:', err);
      setError('Failed to delete track.');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          Track Edit
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>
        <Body>
          {loading ? (
            <LoadingText>Loading...</LoadingText>
          ) : (
            <>
              {error && <ErrorText>{error}</ErrorText>}
              <Field>
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </Field>
              <Field>
                <Label>Artists (comma-separated)</Label>
                <Input value={artists} onChange={e => setArtists(e.target.value)} />
              </Field>
              <Actions>
                <SaveBtn onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </SaveBtn>
                <DeleteBtn onClick={handleDelete}>Delete</DeleteBtn>
              </Actions>
            </>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  max-width: 420px;
  border: 1px solid #333;
  overflow: hidden;
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
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: white;
  }
`;

const Body = styled.div`
  padding: 20px;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  color: #aaa;
  font-size: 0.85rem;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  background: #111;
  border: 1px solid #444;
  border-radius: 8px;
  color: white;
  font-size: 0.95rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0084ff;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 24px;
`;

const SaveBtn = styled.button`
  flex: 1;
  padding: 10px;
  background: #0084ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #0073e6;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DeleteBtn = styled.button`
  flex: 1;
  padding: 10px;
  background: transparent;
  color: #ff4d4d;
  border: 1px solid #ff4d4d;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(255, 77, 77, 0.1);
  }
`;

const LoadingText = styled.p`
  color: #888;
  text-align: center;
`;

const ErrorText = styled.p`
  color: #ff4d4d;
  font-size: 0.85rem;
  margin-bottom: 12px;
`;

export default TrackEditModal;
