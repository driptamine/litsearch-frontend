import { useState, useRef, useEffect } from 'react';
import { styled } from '@linaria/react';
import useCookieState from 'core/hooks2/useCookieState';
import useSelectAuthUser from 'core/hooks/useSelectAuthUser';

const STORAGE_KEY = 'cookie_banner_image';
const LIKE_KEY = 'cookie_banner_likes';
const LIKED_KEY = 'cookie_banner_liked';

const CookieConsent = () => {
  const [consent, setConsent] = useCookieState('cookie_consent', null);
  const [image, setImage] = useState(null);
  const [likes, setLikes] = useState(() => Number(localStorage.getItem(LIKE_KEY) || 0));
  const [liked, setLiked] = useState(() => localStorage.getItem(LIKED_KEY) === 'true');
  const { authUser } = useSelectAuthUser();
  const fileRef = useRef(null);
  const isAdmin = authUser?.is_staff || authUser?.is_superuser;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setImage(saved);
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setImage(dataUrl);
      localStorage.setItem(STORAGE_KEY, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleLike = () => {
    if (liked) return;
    const next = likes + 1;
    setLikes(next);
    setLiked(true);
    localStorage.setItem(LIKE_KEY, String(next));
    localStorage.setItem(LIKED_KEY, 'true');
  };

  if (consent) return null;

  return (
    <>
      <OverlayBg />
      <Banner>
        <Left>
          {image ? (
            <ImageWrap $admin={isAdmin}>
              <MemeImg src={image} alt="meme" />
              {isAdmin && (
                <ImageOverlay onClick={() => fileRef.current?.click()}>Change</ImageOverlay>
              )}
            </ImageWrap>
          ) : isAdmin ? (
            <UploadBtn onClick={() => fileRef.current?.click()}>
              Upload Meme
            </UploadBtn>
          ) : null}
          {isAdmin && (
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
          )}
        </Left>

        <Text>
          Этот сайт использует cookie для улучшения вашего опыта.
        </Text>

        <Actions>
          <LikeBtn onClick={handleLike} $liked={liked}>
            {liked ? '❤️' : '🤍'} {likes}
          </LikeBtn>
          <AcceptBtn onClick={() => setConsent('accepted')}>Accept</AcceptBtn>
          <DeclineBtn onClick={() => setConsent('declined')}>Decline</DeclineBtn>
        </Actions>
      </Banner>
    </>
  );
};

const Banner = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 600px;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 32px;
  background: #1a1a2e;
  color: #ccc;
  font-size: 14px;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
`;

const OverlayBg = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.6);
`;

const Left = styled.div`
  flex-shrink: 0;
`;

const ImageWrap = styled.div`
  position: relative;
  width: 500px;
  height: 340px;
  border-radius: 12px;
  overflow: hidden;
  cursor: ${({ $admin }) => ($admin ? 'pointer' : 'default')};

  &:hover > div {
    opacity: 1;
  }
`;

const MemeImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s;
`;

const UploadBtn = styled.button`
  width: 500px;
  height: 340px;
  border: 2px dashed #555;
  border-radius: 12px;
  background: transparent;
  color: #888;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: #888;
    color: #bbb;
  }
`;

const Text = styled.span`
  flex: none;
  font-size: 22px;
  line-height: 1.4;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const AcceptBtn = styled.button`
  padding: 6px 18px;
  border: none;
  border-radius: 4px;
  background: #bb86fc;
  color: #000;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #a06cdb;
  }
`;

const DeclineBtn = styled.button`
  padding: 6px 18px;
  border: 1px solid #555;
  border-radius: 4px;
  background: transparent;
  color: #ccc;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    border-color: #888;
    color: #fff;
  }
`;

const LikeBtn = styled.button`
  padding: 6px 12px;
  border: 1px solid ${({ $liked }) => ($liked ? '#ff4d6d' : '#555')};
  border-radius: 4px;
  background: ${({ $liked }) => ($liked ? 'rgba(255,77,109,0.15)' : 'transparent')};
  color: ${({ $liked }) => ($liked ? '#ff4d6d' : '#ccc')};
  font-size: 13px;
  cursor: ${({ $liked }) => ($liked ? 'default' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    border-color: #ff4d6d;
    color: #ff4d6d;
  }
`;

export default CookieConsent;
