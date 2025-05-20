import React, { useState } from 'react';
import styled from 'styled-components';

// Styled-components for the Comment Tree
const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 20px;
  padding: 10px;
  border-left: 2px solid #ccc; /* Vertical threadline */
  position: relative;
`;

const CommentLabel = styled.div`
  cursor: pointer;
  background-color: #f3f3f3;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  position: relative;
`;

const ReplyButton = styled.button`
  margin-top: 5px;
  font-size: 12px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: blue;
`;

// Branches connecting comments to replies
const BranchContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  position: relative;
  margin-top: 10px;
  width: 100%;
`;

const BranchLine = styled.div`
  position: absolute;
  width: 40px;
  height: 2px;
  background-color: #ccc;

  ${({ branchPosition }) => branchPosition === 'left' && `
    left: 0;
    transform: translateX(-50%);
  `}

  ${({ branchPosition }) => branchPosition === 'middle' && `
    left: 50%;
    transform: translateX(-50%);
  `}

  ${({ branchPosition }) => branchPosition === 'right' && `
    right: 0;
    transform: translateX(50%);
  `}
`;

const ReplyContainer = styled.div`
  // display: flex;
  justify-content: space-between;
  width: 100%;
  margin-left: 20px;
`;

// Recursive component to display each comment and its replies
const CommentTreeView = ({ comments }) => {
  const [expandedComments, setExpandedComments] = useState([]);

  const toggleComment = (id) => {
    setExpandedComments((prev) =>
      prev.includes(id) ? prev.filter((commentId) => commentId !== id) : [...prev, id]
    );
  };

  const renderComment = (comment) => {
    const isExpanded = expandedComments.includes(comment.id);

    return (
      <CommentContainer key={comment.id}>
        <CommentLabel >
          {comment.text}
        </CommentLabel>

        {/* Three-branch layout */}
        {comment.replies && (
          <BranchContainer >
            <BranchLine branchPosition="left" onClick={() => toggleComment(comment.id)}/>
            {/*<BranchLine branchPosition="middle" />
            <BranchLine branchPosition="right" />*/}
          </BranchContainer>
        )}

        {/* Render child comments */}
        {isExpanded && comment.replies && (
          <ReplyContainer>
            {comment.replies.map((reply) => (
              <div key={reply.id} style={{ flex: 1 }}>
                {renderComment(reply)}
              </div>
            ))}
          </ReplyContainer>
        )}
      </CommentContainer>
    );
  };

  return <div>{comments.map((comment) => renderComment(comment))}</div>;
};

export default CommentTreeView;
