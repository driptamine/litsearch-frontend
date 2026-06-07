import React, { useState } from 'react';
import { styled } from '@linaria/react';

const Comment = ({ comment, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(true);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <CommentContainer depth={depth}>
      <CommentText>{comment.text}</CommentText>
      {comment.replies && comment.replies.length > 0 && (
        <>
          <ToggleButton onClick={toggleReplies}>
            {showReplies ? 'Hide Replies' : 'Show Replies'}
          </ToggleButton>
          {showReplies && (
            <NestedCommentsContainer>
              {comment.replies.map((reply) => (
                <Comment key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </NestedCommentsContainer>
          )}
        </>
      )}
    </CommentContainer>
  );
};

const commentContainerStyles = props => `
  margin-left: ${props.depth > 0 ? 20 : 0}px;
  padding: 10px 10px 10px ${props.depth > 0 ? 20 : 0}px;
  border-left: ${props.depth > 0 ? '2px solid #ddd' : 'none'};
`;

const CommentContainer = styled.div`
  position: relative;
  ${commentContainerStyles}
`;

const CommentText = styled.p`
  margin: 0;
`;

const ToggleButton = styled.button`
  margin-top: 5px;
  background-color: transparent;
  border: none;
  color: #0073e6;
  cursor: pointer;
  font-size: 0.9em;
`;

const NestedCommentsContainer = styled.div`
  margin-top: 10px;
`;

export default Comment;
