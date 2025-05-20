import React, { useState } from 'react';
import styled from 'styled-components';

const Comment = ({ comment, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(true);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <CommentContainer depth={depth} showReplies={showReplies}>
      <CommentText>{comment.text}</CommentText>
      {comment.replies && comment.replies.length > 0 && (
        <>
          <ToggleButton onClick={toggleReplies}>
            {showReplies ? <Minus>-</Minus> : <Plus>+</Plus>}
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

const CommentContainer = styled.div`
  position: relative;
  margin-left: ${(props) => (props.depth > 0 ? 20 : 0)}px;
  padding: 10px 10px 10px ${(props) => (props.showReplies && props.depth > 0 ? 20 : 0)}px;
  border-left: ${(props) => (props.showReplies && props.depth > 0 ? '2px solid #ddd' : 'none')};

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

export default Comment;
