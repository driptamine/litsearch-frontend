import React, { useState } from 'react';
import { styled } from '@linaria/react';
import { FullScreenIcon } from 'views/components/Sidebar/Icons';

const Comment = ({ comment, depth = 0, onReply, replyToId, onSubmitReply }) => {
  const [showReplies, setShowReplies] = useState(true);
  const [replyText, setReplyText] = useState('');

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const isReplying = replyToId === comment.id;

  const handleReplySubmit = (e) => {
    e.preventDefault();
    const val = replyText.trim();
    if (!val) return;
    onSubmitReply(val, comment.id);
    setReplyText('');
  };

  return (
    <StyledComment>
      <LeftBar>
        <UserPic src={comment.avatar} onError={(e) => { e.target.style.display = 'none'; }} /> 
        {showReplies ? (
          <>
            <Collapse onClick={toggleReplies}>
              <Threadline />
            </Collapse>
          </>
        ) : (
          <>
            <Collapse onClick={toggleReplies}>
              <FullScreenIcon />
            </Collapse>
          </>
        )}

      </LeftBar>

      <Right>
        {showReplies && (
          <CommentContainer>
            <Username>{comment.username || 'Anonymous'}</Username>
            <CommentText>{comment.text}</CommentText>
            <Stats>
              <Like />
              <Dislike />
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
                  <ReplyPostBtn type="submit" disabled={!replyText.trim()}>Reply</ReplyPostBtn>
                </ReplyActionRow>
              </ReplyForm>
            )}
          </CommentContainer>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <>
            {showReplies && (
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
          </>
        )}
      </Right>
    </StyledComment>

  );
};

const StyledComment = styled.div`
  display: flex;
  margin-top: 2em;

`;

const commentContainerStyles = props => `
  margin-left: ${props.depth > 0 ? 20 : 0}px;
  padding: 10px 10px 10px ${props.showReplies && props.depth > 0 ? 20 : 0}px;
`;

const CommentContainer = styled.div`
  position: relative;
  ${commentContainerStyles}
  border: 1px solid grey;
  width: fit-content;
`;

// const CommentContainer = styled.div`
//   position: relative;
//   margin-left: ${(props) => (props.depth > 0 ? 20 : 0)}px;
//   padding: 10px 10px 10px ${(props) => (props.showReplies && props.depth > 0 ? 20 : 0)}px;
//   border-left: ${(props) => (props.showReplies && props.depth > 0 ? '2px solid #ddd' : 'none')};
//
// `;

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

const ToggleButton = styled.button`
  display: flex;
  margin-top: 35px;
  background-color: transparent;
  border: none;
  color: #0073e6;
  cursor: pointer;
  font-size: 0.9em;

`;

const NestedCommentsContainer = styled.div`
  margin-top: 10px;
`;

const Minus = styled.div`
  height: 25px;
  width: 25px;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
`
const Plus = styled.div`
  height: 25px;
  width: 25px;
  background-color: white;
  border-radius: 50%;
  display: inline-block;
`
const UserPic = styled.img`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: inline-block;
  object-fit: cover;
`


const LeftBar = styled.div`
  margin-right: 0.125rem;
  font-size: 1rem;
  text-align: center;
  position: relative;
  /* display: flex; */
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Right = styled.div`
  flex: 1 1 auto;
  max-width: 100%;
`;

const Collapse = styled.div`
  height: 100%;
  margin-left: 10px;
  width: 1rem;
  display: flex;
  justify-content: center;
  cursor: pointer;
  :hover > * {
    opacity: 0.5;
  }
  position: absolute;
`;
const Threadline = styled.div`
  background-color: currentColor;
  opacity: 0.3;
  width: 0.125rem;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;

`;
const Like = styled.div`
  border-radius: 25px;
  background: green;

  width: 30px;
  height: 20px;
`;
const Dislike = styled.div`
  border-radius: 25px;
  background: purple;

  width: 30px;
  height: 20px;
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

  &:hover {
    background: rgba(26, 115, 232, 0.1);
  }
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

  &:focus {
    border-color: #1a73e8;
  }
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

  &:hover {
    color: var(--text);
  }
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

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  &:hover:not(:disabled) {
    background: #1557b0;
  }
`;

export default Comment;
