import { styled } from '@linaria/react';

export const CardsContainer = styled.section`
  margin: 50px;
`;

export const Card = styled.div`
  background-color: var(--quoteBgc);
  border: 1px solid var(--quoteBorder);
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  border-radius: 3px;
  max-width: 450px;
`;

export const CardTitle = styled.div`
  color: var(--quoteTitle);
  border-bottom: 1px solid var(--quoteBorder);
  text-align: center;
  padding: 10px;
  font-weight: bold;
`;

export const CardBody = styled.div`
  color: var(--quoteBody);
  padding: 10px;
`;
