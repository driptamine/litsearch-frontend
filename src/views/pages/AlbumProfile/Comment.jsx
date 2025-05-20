import React, { useState } from 'react';
import styled from 'styled-components';

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
          {showReplies &&
            comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} depth={depth + 1} />
            ))}
        </>
      )}
    </CommentContainer>
  );
};

const CommentContainer = styled.div`
  margin-left: ${(props) => props.depth * 20}px;
  padding: 10px;
  border-left: 2px solid #ddd;
  margin-top: 10px;
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
`;

export default Comment;
