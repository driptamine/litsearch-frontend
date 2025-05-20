import React, { useState } from 'react';
import styled from 'styled-components';
import { FullScreenIcon } from "views/components/Sidebar/Icons";

const Comment = ({ comment, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(true);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <StyledComment>
      <LeftBar>
        <UserPic/> 
        {showReplies ? (
          <>
            <Collapse onClick={toggleReplies}>
              <Threadline />
            </Collapse>

            {/*<ToggleButton onClick={toggleReplies}>
              {showReplies ? <Minus>-</Minus> : <Plus>+</Plus>}
            </ToggleButton>*/}
          </>
        ) : (
          <>
            <Collapse onClick={toggleReplies}>
              <FullScreenIcon />
            </Collapse>

            {/*<ToggleButton onClick={toggleReplies}>
              {showReplies ? <Minus>-</Minus> : <Plus>+</Plus>}
            </ToggleButton>*/}
          </>
        )}

      </LeftBar>

      <Right>
        {/*<UserPic/>*/}
        {/*<CommentContainer  showReplies={showReplies}>*/}
        {showReplies && (<CommentContainer  >
          <CommentText>{comment.text}</CommentText>
          <Stats>
          <Like></Like>
          <Dislike></Dislike>
          </Stats>

        </CommentContainer>)}

        {comment.replies && comment.replies.length > 0 && (
          <>

            {showReplies && (
              <NestedCommentsContainer>
                {comment.replies.map((reply) => (
                  <Comment key={reply.id} comment={reply} depth={depth + 1} />
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

const CommentContainer = styled.div`
  position: relative;
  margin-left: ${(props) => (props.depth > 0 ? 20 : 0)}px;
  padding: 10px 10px 10px ${(props) => (props.showReplies && props.depth > 0 ? 20 : 0)}px;
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
const UserPic = styled.div`
  height: 25px;
  width: 25px;
  background-color: Aqua;
  border-radius: 50%;
  display: inline-block;
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
`;
export default Comment;
