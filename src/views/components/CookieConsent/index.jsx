import { styled } from '@linaria/react';
import useCookieState from 'core/hooks2/useCookieState';

const CookieConsent = () => {
  const [consent, setConsent] = useCookieState('cookie_consent', null);

  if (consent) return null;

  return (
    <Banner>
      <Text>
        This site uses cookies to improve your experience.
      </Text>
      <Actions>
        <AcceptBtn onClick={() => setConsent('accepted')}>Accept</AcceptBtn>
        <DeclineBtn onClick={() => setConsent('declined')}>Decline</DeclineBtn>
      </Actions>
    </Banner>
  );
};

const Banner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 24px;
  background: #1a1a2e;
  color: #ccc;
  font-size: 14px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.3);

  @media screen and (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Text = styled.span`
  flex: 1;
  line-height: 1.4;
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

export default CookieConsent;
