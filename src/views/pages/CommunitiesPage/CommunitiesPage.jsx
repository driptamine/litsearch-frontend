import React, { useState, useEffect } from 'react';
import { styled } from '@linaria/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const DEFAULT_ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23333' rx='8'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='%23999' font-size='20' font-family='sans-serif'%3EC%3C/text%3E%3C/svg%3E";

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${LITLOOP_API_URL}/communities/`, { headers: authHeader() });
      setCommunities(res.data.communities || []);
    } catch (err) {
      console.error("Failed to fetch communities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleJoinLeave = async (community) => {
    if (community.user_is_member) {
      try {
        await axios.post(`${LITLOOP_API_URL}/communities/${community.id}/leave/`, null, { headers: authHeader() });
        fetchCommunities();
      } catch (err) {
        console.error("Failed to leave community:", err);
      }
    } else {
      try {
        await axios.post(`${LITLOOP_API_URL}/communities/${community.id}/join/`, null, { headers: authHeader() });
        fetchCommunities();
      } catch (err) {
        console.error("Failed to join community:", err);
      }
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>Communities</Title>
      </Header>

      {loading ? (
        <Message>Loading communities...</Message>
      ) : communities.length === 0 ? (
        <Message>No communities yet.</Message>
      ) : (
        <Grid>
          {communities.map((c) => {
            const iconUrl = c.icon
              ? (c.icon.startsWith('http') ? c.icon : `${LITLOOP_API_URL}${c.icon.startsWith('/') ? '' : '/'}${c.icon}`)
              : DEFAULT_ICON;

            return (
              <Card key={c.id}>
                <CardLink to={`/communities/${c.id}`}>
                  <Icon src={iconUrl} alt={c.name} onError={(e) => { if (e.target.src !== DEFAULT_ICON) e.target.src = DEFAULT_ICON; }} />
                  <Info>
                    <Name>{c.name}</Name>
                    <Meta>
                      <MemberCount>{c.member_count} member{c.member_count !== 1 ? 's' : ''}</MemberCount>
                      {c.user_role && <RoleBadge>{c.user_role}</RoleBadge>}
                    </Meta>
                  </Info>
                </CardLink>
                <ActionBtn
                  onClick={() => handleJoinLeave(c)}
                  joined={c.user_is_member}
                >
                  {c.user_is_member ? 'Leave' : 'Join'}
                </ActionBtn>
              </Card>
            );
          })}
        </Grid>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: var(--text);
  font-size: 24px;
  margin: 0;
`;

const Message = styled.p`
  color: var(--textSecondary, #888);
  text-align: center;
  padding: 40px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background: var(--cardBg, #1e1e1e);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;

  &:hover {
    background: var(--hoverBg, #2a2a2a);
  }
`;

const CardLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  flex: 1;
  min-width: 0;
`;

const Icon = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const Info = styled.div`
  min-width: 0;
`;

const Name = styled.div`
  color: var(--text);
  font-weight: 600;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const MemberCount = styled.span`
  color: var(--textSecondary, #888);
  font-size: 13px;
`;

const RoleBadge = styled.span`
  background: var(--accent, #0084ff);
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: capitalize;
`;

const ActionBtn = styled.button`
  background: ${({ joined }) => (joined ? 'transparent' : 'var(--accent, #0084ff)')};
  color: ${({ joined }) => (joined ? 'var(--text)' : '#fff')};
  border: ${({ joined }) => (joined ? '1px solid var(--border, #444)' : 'none')};
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.15s;

  &:hover {
    opacity: 0.85;
  }
`;

export default CommunitiesPage;
