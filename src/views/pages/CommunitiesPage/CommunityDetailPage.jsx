import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';
import CommunityFormModal from 'views/components/CommunityFormModal';

const DEFAULT_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='%23999' font-size='20' font-family='sans-serif'%3EC%3C/text%3E%3C/svg%3E";

const CommunityDetailPage = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const isNameLookup = communityId && communityId.startsWith('@');
  const lookupValue = isNameLookup ? communityId.slice(1) : communityId;

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
  }, [communityId]);

  if (loading) return <Container><Message>Loading...</Message></Container>;
  if (!community) return <Container><Message>Community not found.</Message></Container>;

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

      <SectionTitle>Posts</SectionTitle>
      {posts.length === 0 ? (
        <Message>No posts yet.</Message>
      ) : (
        <PostList>
          {posts.map((p) => (
            <PostCard key={p.id} to={`/posts/${p.id}`}>
              <PostTitle>{p.title || 'Untitled'}</PostTitle>
              {p.description && <PostDesc>{p.description}</PostDesc>}
            </PostCard>
          ))}
        </PostList>
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
  margin: 24px 0 16px;
`;

const Message = styled.p`
  color: var(--textSecondary, #888);
  text-align: center;
  padding: 40px 0;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PostCard = styled(Link)`
  display: block;
  background: var(--cardBg, #1e1e1e);
  padding: 16px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: var(--hoverBg, #2a2a2a);
  }
`;

const PostTitle = styled.div`
  color: var(--text);
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
`;

const PostDesc = styled.div`
  color: var(--textSecondary, #888);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default CommunityDetailPage;
