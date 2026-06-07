import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { styled } from '@linaria/react';
import { StyledTypography } from 'views/styledComponents';
import Profile from 'views/components/Profile';
import ImageGridList from 'views/components/ImageGridList';
import PostVideoList from './PostVideoList';
import PostTrackList from './PostTrackList';
import PostCard from 'views/components/PostCard';
import { fetchPost } from 'core/actions';
import { selectors } from 'core/reducers/index';
import { verifyCachedData } from 'core/utils';

const REQUIRED_FIELDS = ["description"];

function PostProfile() {
  const dispatch = useDispatch();
  const { postId } = useParams();
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingPost(state, postId)
  );
  const post = useSelector(state => selectors.selectPost(state, postId));

  useEffect(() => {
    dispatch(fetchPost(postId, REQUIRED_FIELDS));
  }, [postId, dispatch]);

  const loading = isFetching || !verifyCachedData(post, REQUIRED_FIELDS);

  return (
    <Profile
      loading={loading}
      main={
        <PostCard>
          <PostContentWrapper>
            <StyledTypography variant="h5" gutterBottom>
              {post?.title || post?.name || (post?.description ? post.description.substring(0, 50) + (post.description.length > 50 ? '...' : '') : 'Post')}
            </StyledTypography>
            <StyledTypography variant="h6" gutterBottom>
              Content
            </StyledTypography>
            <StyledTypography variant="body1">
              {post?.content || post?.description || "No additional content available."}
            </StyledTypography>

            {(post?.photos?.length > 0 || post?.photo_ids?.length > 0) && (
              <>
                <StyledTypography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                  Photos
                </StyledTypography>
                <ImageGridList
                  filePaths={
                    post.photos
                      ? post.photos.map(p => p.image || p.file_path || p.url || p)
                      : post.photo_ids
                  }
                />
              </>
            )}
            {(post?.videos?.length > 0 || post?.video_ids?.length > 0) && (
              <>
                <StyledTypography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                  Videos
                </StyledTypography>
                <PostVideoList videos={post.videos || post.video_ids} />
              </>
            )}
            {(post?.tracks?.length > 0 || post?.track_ids?.length > 0) && (
              <>
                <StyledTypography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                  Tracks
                </StyledTypography>
                <PostTrackList tracks={post.tracks || post.track_ids} />
              </>
            )}
          </PostContentWrapper>
        </PostCard>
      }
    />
  );
}

const PostContentWrapper = styled.div`
  padding: 24px;
`;

export default PostProfile;
