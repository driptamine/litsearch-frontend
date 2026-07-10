import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import CommunityFormModal from 'views/components/CommunityFormModal';
import CommunityPostModal from 'views/components/CommunityPostModal';
import CommunityPostCard from 'views/components/PostCard/CommunityPostCard';
import TrackRow from 'views/components/TrackRow';

const DEFAULT_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='%23999' font-size='20' font-family='sans-serif'%3EC%3C/text%3E%3C/svg%3E";

const CommunityDetailPage = () => {
  const { communityId, handle, mediaType } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const activeTab = mediaType || 'all';

  const idOrHandle = handle || communityId;
  const isNameLookup = !!handle;
  const lookupValue = handle || communityId;

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const url = isNameLookup
          ? `${LITLOOP_API_URL}/communities/@${encodeURIComponent(lookupValue)}/`
          : `${LITLOOP_API_URL}/communities/${lookupValue}/`;

        const detailRes = await axios.get(url, { headers: authHeader() });
        setCommunity(detailRes.data);

        const communityIdNum = detailRes.data.id;
        const postsRes = await axios.get(`${LITLOOP_API_URL}/communities/${communityIdNum}/posts/`, { headers: authHeader() });
        setPosts(postsRes.data.posts || []);
      } catch (err) {
        console.error("Failed to fetch community:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [idOrHandle]);

  if (loading) return <Container><Message>Loading...</Message></Container>;
  if (!community) return <Container><Message>Community not found.</Message></Container>;

  const formatPostTime = (timeStr) => {
    if (!timeStr) return '';
    const d = new Date(timeStr);
    const now = new Date();
    const diff = (now - d) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return d.toLocaleDateString();
  };

  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${LITLOOP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const filteredPosts = posts.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'tracks') return p.tracks?.length > 0;
    if (activeTab === 'photos') return p.photos?.length > 0;
    if (activeTab === 'videos') return p.videos?.length > 0;
    return true;
  });

  const basePath = handle ? `/communities/@${handle}` : `/communities/${communityId}`;

  const tabs = [
    { key: 'all', label: 'All', to: basePath },
    { key: 'tracks', label: 'Tracks', to: `${basePath}/tracks` },
    { key: 'photos', label: 'Photos', to: `${basePath}/photos` },
    { key: 'videos', label: 'Videos', to: `${basePath}/videos` },
  ];

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`${LITLOOP_API_URL}/posts/${postId}/like/`, null, { headers: authHeader() });
      setPosts((prev) => prev.map((p) =>
        (p.id || p.post_id) === postId
          ? { ...p, is_liked: res.data.is_liked, likes_count: res.data.likes_count }
          : p
      ));
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    setPosts((prev) => prev.filter((p) => (p.id || p.post_id) !== postId));
    try {
      await axios.delete(`${LITLOOP_API_URL}/posts/delete_no_drf/${postId}/`, { headers: authHeader() });
    } catch {}
  };

  return (
    <>
    <Container>
      <Banner style={{ background: community.banner ? `url(${community.banner}) center/cover` : 'var(--cardBg)' }}>
        <Icon src={community.icon || DEFAULT_ICON} alt={community.name} />
      </Banner>
      <InfoSection>
        <NameRow>
          <Name>{community.name}</Name>
          {community.user_role === 'admin' && (
            <EditBtn onClick={() => setShowEdit(true)}>Edit</EditBtn>
          )}
        </NameRow>
        <Description>{community.description}</Description>
        <Meta>
          <span>{community.member_count} member{community.member_count !== 1 ? 's' : ''}</span>
          {community.user_role && <Badge>{community.user_role}</Badge>}
        </Meta>
      </InfoSection>

      <TabsRow>
        {tabs.map((t) => (
          <TabLink key={t.key} to={t.to} data-active={activeTab === t.key}>
            {t.label}
          </TabLink>
        ))}
      </TabsRow>

      <SectionRow>
        <SectionTitle>Posts</SectionTitle>
        {community.user_is_member && (
          <PostBtn onClick={() => setShowPostModal(true)}>
            {community.user_role === 'admin' || community.user_role === 'moderator' ? '+ Create Post' : '+ Request Post'}
          </PostBtn>
        )}
      </SectionRow>
      {activeTab === 'tracks' ? (
        filteredPosts.length === 0 ? (
          <Message>No tracks yet.</Message>
        ) : (
          <MediaList>
            {filteredPosts.map((p) =>
              (p.tracks || []).map((track, ti) => (
                <TrackRowItem key={`${p.id}_track_${track.id || ti}`}>
                  <TrackRow
                    track={{ ...track, postId: p.id }}
                    index={ti}
                  />
                  <TrackPostMeta>
                    from <PostLink to={`${basePath}`}>post by {p.author?.username}</PostLink>
                  </TrackPostMeta>
                </TrackRowItem>
              ))
            )}
          </MediaList>
        )
      ) : activeTab === 'photos' ? (
        filteredPosts.length === 0 ? (
          <Message>No photos yet.</Message>
        ) : (
          <PhotoGrid>
            {filteredPosts.map((p) =>
              (p.photos || []).map((photo) => (
                <PhotoCard key={`${p.id}_photo_${photo.id}`}>
                  <PhotoImg src={photo.r2_url || photo.gcs_url || photo.url} alt={photo.title || ''} />
                </PhotoCard>
              ))
            )}
          </PhotoGrid>
        )
      ) : activeTab === 'videos' ? (
        filteredPosts.length === 0 ? (
          <Message>No videos yet.</Message>
        ) : (
          <PostList>
            {filteredPosts.map((p) => (
              <CommunityPostCard
                key={p.id || p.post_id}
                post={p}
                community={community}
                onLike={handleLike}
                onDelete={handleDelete}
                formatPostTime={formatPostTime}
                getFullUrl={getFullUrl}
              />
            ))}
          </PostList>
        )
      ) : (
        filteredPosts.length === 0 ? (
          <Message>No posts yet.</Message>
        ) : (
          <PostList>
            {filteredPosts.map((p) => (
              <CommunityPostCard
                key={p.id || p.post_id}
                post={p}
                community={community}
                onLike={handleLike}
                onDelete={handleDelete}
                formatPostTime={formatPostTime}
                getFullUrl={getFullUrl}
              />
            ))}
          </PostList>
        )
      )}
    </Container>

    {showEdit && (
      <CommunityFormModal
        mode="edit"
        community={community}
        onClose={() => setShowEdit(false)}
        onSaved={(updated) => {
          setCommunity(updated);
          setShowEdit(false);
        }}
      />
    )}

    {showPostModal && (
      <CommunityPostModal
        communityId={community.id}
        isAdminOrMod={community.user_role === 'admin' || community.user_role === 'moderator'}
        onClose={() => setShowPostModal(false)}
        onSaved={() => {
          setShowPostModal(false);
          const communityIdNum = community.id;
          axios.get(`${LITLOOP_API_URL}/communities/${communityIdNum}/posts/`, { headers: authHeader() })
            .then((res) => setPosts(res.data.posts || []))
            .catch(() => {});
        }}
      />
    )}
    </>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const Banner = styled.div`
  height: 200px;
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  padding: 20px;
`;

const Icon = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid var(--navBg, #141414);
`;

const InfoSection = styled.div`
  padding: 20px 0;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
`;

const Name = styled.h1`
  color: var(--text);
  font-size: 28px;
  margin: 0;
`;

const EditBtn = styled.button`
  background: transparent;
  border: 1px solid var(--border, #444);
  color: var(--text);
  padding: 4px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    background: var(--hoverBg, #2a2a2a);
  }
`;

const Description = styled.p`
  color: var(--textSecondary, #888);
  font-size: 15px;
  margin: 0 0 12px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--textSecondary, #888);
  font-size: 14px;
`;

const Badge = styled.span`
  background: var(--accent, #0084ff);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: capitalize;
`;

const SectionTitle = styled.h2`
  color: var(--text);
  font-size: 20px;
  margin: 0;
`;

const TabsRow = styled.div`
  display: flex;
  gap: 4px;
  margin: 16px 0 0;
  background: var(--cardBg, #1e1e1e);
  border-radius: 8px;
  padding: 4px;
`;

const TabLink = styled(Link)`
  flex: 1;
  text-align: center;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--textSecondary, #888);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;

  &[data-active='true'] {
    background: var(--accent, #0084ff);
    color: #fff;
  }

  &:not([data-active='true']):hover {
    background: rgba(255,255,255,0.06);
    color: var(--text);
  }
`;

const SectionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 16px;
`;

const PostBtn = styled.button`
  background: var(--accent, #0084ff);
  border: none;
  color: #fff;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;

  &:hover {
    opacity: 0.85;
  }
`;

const Message = styled.p`
  color: var(--textSecondary, #888);
  text-align: center;
  padding: 40px 0;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
`;

const MediaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TrackRowItem = styled.div`
  background: var(--cardBg, #1e1e1e);
  border-radius: 8px;
  overflow: hidden;
`;

const TrackPostMeta = styled.div`
  padding: 4px 12px 8px;
  font-size: 12px;
  color: var(--textSecondary, #888);

  a {
    color: var(--accent, #0084ff);
    text-decoration: none;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

const PhotoCard = styled.div`
  background: var(--cardBg, #1e1e1e);
  border-radius: 8px;
  overflow: hidden;
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
`;

const PostLink = styled(Link)`
  color: var(--accent, #0084ff);
  text-decoration: none;
`;

export default CommunityDetailPage;
