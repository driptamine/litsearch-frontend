import React from 'react';
import { styled } from '@linaria/react';

const CreditsPage = () => {
  return (
    <Container>
      <Title>Credits</Title>
      <Section>
        <SectionTitle>Tech Stack</SectionTitle>
        <List>
          <Item><strong>Frontend:</strong> React, Redux, Linaria, React Router</Item>
          <Item><strong>Backend:</strong> Django, Celery, Redis</Item>
          <Item><strong>Database:</strong> PostgreSQL</Item>
          <Item><strong>APIs:</strong> TMDB, IMDb</Item>
        </List>
      </Section>
      <Section>
        <SectionTitle>Data Sources</SectionTitle>
        <Text>Movie metadata provided by <Link href="https://www.themoviedb.org" target="_blank">TMDB</Link> and <Link href="https://www.imdb.com" target="_blank">IMDb</Link>.</Text>
      </Section>
      <Section>
        <SectionTitle>License</SectionTitle>
        <Text>Litloop — All rights reserved.</Text>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  max-width: 600px;
  margin: 2em auto;
  padding: 0 1em;
`;

const Title = styled.h1`
  color: white;
  font-family: Verdana;
  font-size: 24px;
  margin-bottom: 1.5em;
`;

const Section = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.25em;
  margin-bottom: 1em;
`;

const SectionTitle = styled.h2`
  color: white;
  font-family: Verdana;
  font-size: 16px;
  margin: 0 0 0.75em 0;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  color: #ccc;
  font-family: Verdana;
  font-size: 14px;
  padding: 0.35em 0;
  border-bottom: 1px solid #2a2a2a;

  &:last-child {
    border-bottom: none;
  }
`;

const Text = styled.p`
  color: #ccc;
  font-family: Verdana;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
`;

const Link = styled.a`
  color: #686cb9;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default CreditsPage;
