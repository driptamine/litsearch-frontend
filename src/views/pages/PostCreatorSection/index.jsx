import React from 'react';
import { styled } from '@linaria/react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostCreatorV2 from 'views/components/upload/uploader/posts/PostCreator';

const PostCreatorSection = () => {
  const history = useHistory();
  const username = useSelector((state) => state.users?.username);

  const handlePostSuccess = (newPost) => {
    history.push(`/${username}`, { newPost });
  };

  return (
    <Wrapper>
      <Container>
        <PostCreatorV2 onPostSuccess={handlePostSuccess} />
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: var(--navBg, #141414);
  display: flex;
  justify-content: center;
  padding: 40px 20px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 680px;
`;

export default PostCreatorSection;
