import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useHistory, useRouteMatch } from 'react-router-dom';
import { styled } from '@linaria/react';
import { FaArrowLeft } from 'react-icons/fa';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { getAxiosReq } from 'core/api/rest-helper';

const TABS = ['Photos', 'Videos', 'Tracks'];
const TAB_TYPE = { Photos: 'photo', Videos: 'video', Tracks: 'track' };

const Attachments = () => {
  const { userId, chatId } = useParams();
  const isGroupMatch = useRouteMatch('/chat/group/:chatId/attachments');
  const isGroup = !!isGroupMatch;
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('Photos');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const url = isGroup
          ? `${LITLOOP_API_URL}/chats/group/${chatId}/`
          : `${LITLOOP_API_URL}/chats/direct/${userId}/`;
        const res = await getAxiosReq(url);
        setMessages(res.data?.messages || []);
      } catch (_) {}
      setLoading(false);
    };
    fetch();
  }, [userId, chatId, isGroup]);

  const attachments = useMemo(() => {
    const type = TAB_TYPE[activeTab];
    const items = [];
    for (const msg of messages) {
      if (!msg.attachments?.length) continue;
      for (const att of msg.attachments) {
        if (att.type === type) {
          items.push({ ...att, created_at: msg.created_at });
        }
      }
    }
    return items;
  }, [messages, activeTab]);

  return (
    <Container>
      <Header>
        <BackButton onClick={() => history.goBack()}>
          <FaArrowLeft />
        </BackButton>
        <Title>Attachments</Title>
      </Header>
      <Tabs>
        {TABS.map((tab) => (
          <Tab key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>
            {tab}
          </Tab>
        ))}
      </Tabs>
      <Content>
        {loading ? (
          <EmptyState>Loading...</EmptyState>
        ) : attachments.length === 0 ? (
          <EmptyState>No {activeTab.toLowerCase()} found</EmptyState>
        ) : activeTab === 'Photos' ? (
          <Grid>
            {attachments.map((att, i) => (
              <Thumb key={i} src={resolveUrl(att.url)} alt={att.name} onClick={() => window.open(resolveUrl(att.url), '_blank')} />
            ))}
          </Grid>
        ) : activeTab === 'Videos' ? (
          <List>
            {attachments.map((att, i) => (
              <VideoItem key={i}>
                <video src={resolveUrl(att.url)} controls preload="metadata" />
              </VideoItem>
            ))}
          </List>
        ) : (
          <List>
            {attachments.map((att, i) => (
              <TrackItem key={i}>
                <TrackName>{att.name}</TrackName>
                <audio src={resolveUrl(att.url)} controls preload="none" />
              </TrackItem>
            ))}
          </List>
        )}
      </Content>
    </Container>
  );
};

const resolveUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${LITLOOP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: #fff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  &:hover { background: rgba(255,255,255,0.1); }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid #333;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  color: ${({ active }) => (active ? '#009688' : '#888')};
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid ${({ active }) => (active ? '#009688' : 'transparent')};
  margin-bottom: -2px;
  transition: color 0.2s;
  font-size: 14px;
  &:hover { color: #009688; }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #888;
  font-size: 15px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
`;

const Thumb = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const VideoItem = styled.div`
  video { width: 100%; max-height: 300px; border-radius: 8px; }
`;

const TrackItem = styled.div`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 12px;
  audio { width: 100%; }
`;

const TrackName = styled.div`
  font-size: 13px;
  margin-bottom: 6px;
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default Attachments;
