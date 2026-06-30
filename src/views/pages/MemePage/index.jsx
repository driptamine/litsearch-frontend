import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';

function MemePage() {
  const { id } = useParams();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${LITLOOP_API_URL}/memes/`)
      .then(res => setMemes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const meme = memes[id];

  if (loading) return <Container><Message>Loading...</Message></Container>;
  if (!meme) return <Container><Message>Meme not found.</Message></Container>;

  return (
    <Container>
      <Image src={meme.url} alt={meme.title} />
      <Title>{meme.title}</Title>
      <Meta>
        <span>r/{meme.subreddit}</span>
        <span>by {meme.author}</span>
        <span>↑ {meme.ups}</span>
      </Meta>
      <Link href={meme.post_link} target="_blank" rel="noopener noreferrer">View on Reddit</Link>
    </Container>
  );
}

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  color: var(--text, #FAFAFA);
`;

const Image = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const Title = styled.h2`
  margin: 16px 0 8px;
  font-size: 1.2rem;
`;

const Meta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--grey, #999);
  margin-bottom: 16px;
`;

const Link = styled.a`
  color: var(--titleColor, #99c3ff);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.p`
  text-align: center;
  padding: 40px;
  color: var(--grey, #999);
`;

export default MemePage;
