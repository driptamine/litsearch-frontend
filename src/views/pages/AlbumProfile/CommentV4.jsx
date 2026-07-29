import React, { useState } from 'react';
import { styled } from '@linaria/react';

const ShowReplies = ({ show, onClick }) => (
  <ShowRepliesWrap onClick={onClick}>
    <ShowRepliesIcon>{show ? '−' : '+'}</ShowRepliesIcon>
  </ShowRepliesWrap>
);

const Comment = ({ comment, depth = 0, onReply, replyToId, onSubmitReply, onVote }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [vote, setVote] = useState(0);

  const toggleCollapse = () => setCollapsed(c => !c);
  const toggleReplies = () => setShowReplies(s => !s);

  const handleVote = (dir) => {
    const next = vote === dir ? 0 : dir;
    setVote(next);
    onVote?.(comment.id, next);
  };

  const isReplying = replyToId === comment.id;

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const val = replyText.trim();
    if (!val) return;
    setSubmitting(true);
    try {
      await onSubmitReply(val, comment.id);
      setReplyText('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledComment>
      <LeftBar>
        <BranchRow>
          {depth > 0 && <HorizLine />}
          <UserPic src={comment.avatar} onError={(e) => { e.target.style.display = 'none'; }} />
        </BranchRow>
        <Threadline onClick={toggleCollapse} />
      </LeftBar>

      {collapsed ? (
        <CollapsedRow onClick={toggleCollapse}>
          <ShowReplies show={false} />
          <CollapsedText>{comment.username || 'Anonymous'} — {comment.text}</CollapsedText>
        </CollapsedRow>
      ) : (
        <Right>
          <CommentContainer>
            <Username>{comment.username || 'Anonymous'}</Username>
            <CommentText>{comment.text}</CommentText>
            <Stats>
              <ShowReplies show={showReplies} onClick={toggleReplies} />
              <VoteBtn direction="up" onClick={() => handleVote(1)} active={vote === 1}>↑</VoteBtn>
              <VoteScore vote={vote}>{(comment.score || 0) + vote}</VoteScore>
              <VoteBtn direction="down" onClick={() => handleVote(-1)} active={vote === -1}>↓</VoteBtn>
              {onReply && (
                <ReplyBtn onClick={() => onReply(comment.id)}>Reply</ReplyBtn>
              )}
            </Stats>
            {isReplying && (
              <ReplyForm onSubmit={handleReplySubmit}>
                <ReplyInput
                  autoFocus
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                />
                <ReplyActionRow>
                  <CancelBtn type="button" onClick={() => onReply(null)}>Cancel</CancelBtn>
                  <ReplyPostBtn type="submit" disabled={!replyText.trim() || submitting}>
                    {submitting ? <Spinner /> : 'Reply'}
                  </ReplyPostBtn>
                </ReplyActionRow>
              </ReplyForm>
            )}
          </CommentContainer>

          {comment.replies && comment.replies.length > 0 && showReplies && (
            <NestedCommentsContainer>
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onReply={onReply}
                  replyToId={replyToId}
                  onSubmitReply={onSubmitReply}
                />
              ))}
            </NestedCommentsContainer>
          )}
        </Right>
      )}
    </StyledComment>
  );
};

const StyledComment = styled.div`
  display: flex;
  margin-top: 2em;
`;

const LeftBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 0.125rem;
`;

const BranchRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const HorizLine = styled.div`
  flex: 1;
  height: 0.125rem;
  background-color: var(--textColor1);
  opacity: 0.3;
  min-width: 0.75rem;
`;

const Right = styled.div`
  flex: 1 1 auto;
  max-width: 100%;
`;

const UserPic = styled.img`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: inline-block;
  object-fit: cover;
`;

const Threadline = styled.div`
  background-color: var(--textColor1);
  opacity: 0.3;
  width: 0.125rem;
  flex: 1;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover { opacity: 0.6; }
`;

const ShowRepliesWrap = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--textColor2);
  font-size: 1rem;
  font-weight: 700;
  border-radius: 50%;
  border: 1px solid var(--textColor2);
  user-select: none;
  margin-left: -1.75rem;
  flex-shrink: 0;
  background: var(--backgroundColor);
  z-index: 1;
  &:hover { color: var(--textColor1); border-color: var(--textColor1); }
`;

const ShowRepliesIcon = styled.span``;

const CommentContainer = styled.div`
  position: relative;
  border: 1px solid grey;
  width: fit-content;
`;

const CommentText = styled.p`
  margin: 0;
`;

const Username = styled.span`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
`;

const NestedCommentsContainer = styled.div`
  margin-top: 10px;
`;

const CollapsedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 0;
`;

const CollapsedText = styled.span`
  font-size: 0.8rem;
  color: var(--textColor2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VoteBtn = styled.button`
  background: none;
  border: none;
  color: ${p => p.direction === 'up'
    ? (p.active ? '#ff4500' : 'var(--textColor2)')
    : (p.active ? '#7193ff' : 'var(--textColor2)')};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  border-radius: 2px;
  &:hover { color: ${p => p.direction === 'up' ? '#ff4500' : '#7193ff'}; }
`;

const VoteScore = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${p => p.vote === 1 ? '#ff4500' : p.vote === -1 ? '#7193ff' : 'var(--textColor1)'};
  min-width: 1.5em;
  text-align: center;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;

const ReplyBtn = styled.button`
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 4px;
  &:hover { background: rgba(26, 115, 232, 0.1); }
`;

const ReplyForm = styled.form`
  margin-top: 8px;
`;

const ReplyInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #555;
  background: #1a1a1a;
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: #1a73e8; }
`;

const ReplyActionRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 6px;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 4px 12px;
  &:hover { color: var(--text); }
`;

const ReplyPostBtn = styled.button`
  padding: 4px 16px;
  border-radius: 6px;
  border: none;
  background: #1a73e8;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 4.5rem;
  &:disabled { opacity: 0.4; cursor: default; }
  &:hover:not(:disabled) { background: #1557b0; }
`;

const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default Comment;
