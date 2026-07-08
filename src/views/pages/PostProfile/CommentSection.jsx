import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import CommentV4 from 'views/pages/AlbumProfile/CommentV4';
import { fetchPostComments, createPostComment } from './postCommentsApi';

const buildTree = (flat) => {
  const map = {};
  const roots = [];
  flat.forEach((c) => {
    map[c.id] = { ...c, replies: [] };
  });
  flat.forEach((c) => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
};

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyToId, setReplyToId] = useState(null);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    fetchPostComments(postId)
      .then((data) => setComments(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = text.trim();
    if (!val) return;
    try {
      const saved = await createPostComment(postId, val);
      setComments((prev) => [...prev, saved]);
      setText('');
    } catch {}
  };

  const handleReplySubmit = async (val, parentId) => {
    try {
      const saved = await createPostComment(postId, val, parentId);
      setComments((prev) => [...prev, saved]);
      setReplyToId(null);
    } catch {}
  };

  const tree = buildTree(comments);

  return (
    <Section>
      <Title>Comments</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button type="submit" disabled={!text.trim()}>Post</Button>
      </Form>
      {loading ? (
        <p style={{ color: '#888' }}>Loading comments...</p>
      ) : tree.length === 0 ? (
        <p style={{ color: '#888' }}>No comments yet.</p>
      ) : (
        tree.map((c) => (
          <CommentV4
            key={c.id}
            comment={c}
            onReply={setReplyToId}
            replyToId={replyToId}
            onSubmitReply={handleReplySubmit}
          />
        ))
      )}
    </Section>
  );
};

const Section = styled.div`
  border-top: 1px solid #333;
  margin-top: 24px;
  padding-top: 16px;
`;

const Title = styled.h3`
  color: var(--text);
  margin: 0 0 12px 0;
`;

const Form = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #555;
  background: #1a1a1a;
  color: var(--text);
  font-size: 0.95rem;
  outline: none;

  &:focus {
    border-color: #1a73e8;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #1a73e8;
  color: #fff;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  &:hover:not(:disabled) {
    background: #1557b0;
  }
`;

export default CommentSection;
