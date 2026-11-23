import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@linaria/react';
import { chatRequest } from 'core/api/chatSession';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';

const isAdmin = (authUser) => {
  const username = authUser?.username || authUser?.user?.username || authUser?.user__username || '';
  return authUser?.is_superuser || authUser?.is_staff || String(username).toLowerCase() === 'drip';
};

const AdminUsernames = () => {
  const { authUser, isSignedIn } = useSelectAuthUser();
  const [entries, setEntries] = useState([]);
  const [usernames, setUsernames] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await chatRequest('/admin/usernames/');
      setEntries(data?.usernames || []);
    } catch (err) {
      setError(err.response?.status === 403 ? 'Admin access required.' : 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSignedIn) fetchEntries();
    else setLoading(false);
  }, [isSignedIn, fetchEntries]);

  const handleReserve = async () => {
    if (!usernames.trim() || !assignTo.trim() || saving) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const { data } = await chatRequest('/admin/usernames/', {
        method: 'post',
        data: { usernames, assign_to: assignTo.trim() },
      });
      const reservedCount = (data?.reserved || []).length;
      const skipped = data?.skipped || [];
      setNotice(`Reserved ${reservedCount}.` + (skipped.length
        ? ` Skipped: ${skipped.map(s => `${s.username} (${s.reason})`).join(', ')}.`
        : ''));
      setUsernames('');
      fetchEntries();
    } catch (err) {
      const status = err.response?.status;
      setError(status === 404 ? `User "${assignTo.trim()}" not found.`
        : status === 403 ? 'Admin access required.'
        : (err.response?.data?.error || 'Reservation failed.'));
    } finally {
      setSaving(false);
    }
  };

  const handleRelease = async (username) => {
    if (!window.confirm(`Release @${username}? It becomes available to everyone.`)) return;
    setError(null);
    try {
      await chatRequest(`/admin/usernames/${encodeURIComponent(username)}`, { method: 'delete' });
      setEntries(prev => prev.filter(entry => entry.username !== username));
    } catch {
      setError('Release failed.');
    }
  };

  if (!isSignedIn) {
    return (
      <Wrapper>
        <Message>Log in to open the admin panel.</Message>
      </Wrapper>
    );
  }

  if (!isAdmin(authUser)) {
    return (
      <Wrapper>
        <Message error>Admin access required.</Message>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>Reserved usernames</Title>
      <Hint>Reserve handles and attach them to an existing user. Only the assignee can take a reserved name; everyone else sees it as taken.</Hint>
      <Form>
        <Field>
          <Label>Usernames to reserve</Label>
          <TextInput
            value={usernames}
            onChange={(e) => setUsernames(e.target.value)}
            placeholder={'neo, trinity\nmorpheus'}
            rows={3}
          />
        </Field>
        <Field>
          <Label>Attach to user</Label>
          <TextInputSmall
            value={assignTo}
            onChange={(e) => setAssignTo(e.target.value)}
            placeholder="Existing username, e.g. bob"
          />
        </Field>
        <ReserveBtn onClick={handleReserve} disabled={saving || !usernames.trim() || !assignTo.trim()}>
          {saving ? 'Reserving…' : 'Reserve'}
        </ReserveBtn>
      </Form>
      {notice && <Notice>{notice}</Notice>}
      {error && <ErrorText>{error}</ErrorText>}
      {loading && <Message>Loading…</Message>}
      {!loading && entries.length === 0 && !error && (
        <Message>No reservations yet.</Message>
      )}
      <List>
        {entries.map(entry => (
          <Row key={entry.id || entry.username}>
            <Name>@{entry.username}</Name>
            <Assignee>
              → {entry.assigned_to ? (
                <UserLink to={`/${entry.assigned_to.username}`}>@{entry.assigned_to.username}</UserLink>
              ) : 'unassigned'}
            </Assignee>
            <ReleaseBtn onClick={() => handleRelease(entry.username)}>Release</ReleaseBtn>
          </Row>
        ))}
      </List>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 20px 80px;
`;

const Title = styled.h2`
  margin: 0 0 6px;
  color: white;
`;

const Hint = styled.p`
  color: #888;
  font-size: 0.85rem;
  line-height: 1.5;
  margin: 0 0 16px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.span`
  color: #bbb;
  font-size: 0.8rem;
  font-weight: 600;
`;

const TextInput = styled.textarea`
  background: #111;
  color: white;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  &:focus { outline: none; border-color: #0084ff; }
`;

const TextInputSmall = styled.input`
  background: #111;
  color: white;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.95rem;
  font-family: inherit;
  &:focus { outline: none; border-color: #0084ff; }
`;

const ReserveBtn = styled.button`
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: 0.4; cursor: default; }
  &:hover:not(:disabled) { background-color: #0073e6; }
`;

const Notice = styled.div`
  color: #4db6ac;
  font-size: 0.85rem;
  margin-bottom: 8px;
`;

const ErrorText = styled.div`
  color: #ff5252;
  font-size: 0.85rem;
  margin-bottom: 8px;
`;

const Message = styled.p`
  text-align: center;
  padding: 30px 20px;
  color: ${({ error }) => (error ? '#ff4d4d' : '#888')};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 10px;
  padding: 10px 14px;
`;

const Name = styled.span`
  color: white;
  font-weight: 700;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Assignee = styled.span`
  flex: 1;
  color: #888;
  font-size: 0.85rem;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserLink = styled(Link)`
  color: #4db6ac;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const ReleaseBtn = styled.button`
  background: none;
  border: 1px solid #555;
  color: #ff8a80;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  flex-shrink: 0;
  &:hover { border-color: #ff5252; }
`;

export default AdminUsernames;
