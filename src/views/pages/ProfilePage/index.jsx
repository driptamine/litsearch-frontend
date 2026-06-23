import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import  {Link, useParams, useLocation }  from 'react-router-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';
import { fetchCurrentUser, uploadAvatarAction } from 'core/actions';
import { LITLOOP_API_URL } from 'core/constants/urls';
import PostCreator from 'views/components/upload/uploader/posts/PostCreator';
import UserPosts from './UserPosts';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%23999'/%3E%3Cpath d='M8 44c0-8.84 7.16-16 16-16s16 7.16 16 16' fill='%23999'/%3E%3C/svg%3E";

const ProfilePage = () => {
  const { username: urlUsername } = useParams();
  const { authUser, isSignedIn } = useSelectAuthUser();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [newPosts, setNewPosts] = useState([]);
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const displayUsername = urlUsername || authUser?.username || authUser?.user?.username || authUser?.user__username;

  useEffect(() => {
    const state = location.state;
    if (state?.newPost) {
      setNewPosts(prev => [state.newPost, ...prev]);
    }
  }, [location.state?.newPost]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!displayUsername) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`${LITLOOP_API_URL}/users/${displayUsername}/`);
        setProfileData(response.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [displayUsername]);

  useEffect(() => {
    if (isSignedIn && !urlUsername) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isSignedIn, urlUsername]);

  const handlePostSuccess = (newPost) => {
    setNewPosts(prev => [newPost, ...prev]);
  };

  const isOwnProfile = !urlUsername ||
    urlUsername === authUser?.username ||
    urlUsername === authUser?.user?.username ||
    urlUsername === authUser?.user__username;

  if (!isSignedIn && isOwnProfile && !urlUsername) {
    return (
      <Container>
        <MessageCard>
          <h2>Please log in to view your profile.</h2>
        </MessageCard>
      </Container>
    );
  }

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      dispatch(uploadAvatarAction(formData)).then(() => {
        // Refresh profile data after upload
        if (displayUsername) {
          axios.get(`${LITLOOP_API_URL}/users/${displayUsername}/`).then(res => setProfileData(res.data));
        }
      });
    }
  };

  const getFullUrl = (url) => {
    if (!url) return DEFAULT_AVATAR;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('//')) {
      return url.startsWith('//') ? `https:${url}` : url;
    }
    return `${LITLOOP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const profileImg = getFullUrl(profileData?.avatar || profileData?.profile_img || profileData?.profileImg);
  const email = isOwnProfile ? (profileData?.email || authUser?.email || authUser?.user?.email) : null;
  const fullName = profileData?.full_name || (profileData?.first_name ? `${profileData.first_name} ${profileData.last_name || ''}`.trim() : null);

  return (
    <Container>
      <ProfileCard>
        <AvatarWrapper onClick={handleAvatarClick} style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}>
           <ProfileImage src={profileImg} alt={displayUsername} />
           {isOwnProfile && (
             <UploadOverlay className="upload-overlay">
               <span>Change</span>
             </UploadOverlay>
           )}
        </AvatarWrapper>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <UserInfo>
          <Username>{displayUsername}</Username>
          {fullName && <FullName>{fullName}</FullName>}
          {email && <Email>{email}</Email>}
          {profileData?.bio && <Bio>{profileData.bio}</Bio>}
        </UserInfo>

        {!isOwnProfile && (
          <ActionButtons>
            <FollowButton>Follow</FollowButton>
            <MessageButton to={`/chat/${profileData?.id || profileData?.pk || profileData?.user_id}`} title="Message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </MessageButton>
          </ActionButtons>
        )}
      </ProfileCard>

      {isOwnProfile && (
        <PostCreatorSection>
          <ModalHeader>
            <span>Create Post</span>
          </ModalHeader>
          <ModalBody>
            <PostCreator onPostSuccess={handlePostSuccess} />
          </ModalBody>
        </PostCreatorSection>
      )}

      <TracksButton to={`/${displayUsername}/tracks`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
        Tracks
      </TracksButton>

      <PostsSection>
        <SectionTitle>{isOwnProfile ? 'Your Posts' : `${displayUsername}'s Posts`}</SectionTitle>
        <UserPosts key={location.key} username={displayUsername} newPosts={newPosts} isOwnProfile={isOwnProfile} />
      </PostsSection>
    </Container>
  );
};

const Bio = styled.p`
  margin-top: 10px;
  color: #aaa;
  font-size: 0.95rem;
  max-width: 300px;
  line-height: 1.4;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 80vh;
  padding: 40px 20px;
  background-color: var(--navBg, #141414);
  gap: 40px;
`;

const MessageCard = styled.div`
  background-color: #1a1a1a;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  color: white;
  border: 1px solid #333;
`;

const ProfileCard = styled.div`
  background-color: #1a1a1a;
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
`;

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
  border: 4px solid #0084ff;

  &:hover .upload-overlay {
    opacity: 1;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const Username = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.5rem;
`;

const FullName = styled.h3`
  margin: 5px 0;
  color: #888;
  font-size: 1.1rem;
  font-weight: 400;
`;

const Email = styled.p`
  margin-top: 15px;
  color: #666;
  font-size: 0.9rem;
`;

const FollowButton = styled.button`
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  flex: 1;

  &:hover {
    background-color: #0073e6;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const MessageButton = styled(Link)`
  background-color: transparent;
  color: #0084ff;
  border: 2px solid #0084ff;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(0, 132, 255, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 10px;
  align-items: center;
`;

const TracksButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: transparent;
  color: #1db954;
  border: 2px solid #1db954;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(29, 185, 84, 0.1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const PostCreatorSection = styled.div`
  display: none;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid var(--darkGrey);
`;

const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const PostsSection = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 0 20px;
`;

const SectionTitle = styled.h3`
  color: white;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5rem;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
`;

export default ProfilePage;
