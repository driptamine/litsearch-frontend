import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@linaria/react';

import Button from 'views/components/Button';
import BaseImage from 'views/components/BaseImage';
import BaseCard from 'views/components/BaseCard';
import RouterLink from 'views/components/RouterLink';
import ModalLink from 'views/components/ModalLink';
import BaseCardHeader from 'views/components/BaseCardHeader';
import LikeIcon from 'views/components/LikeIcon';
// import HideUrlPrefix from 'views/components/WebsiteCard/HideUrlPrefix';
// import { getAspectRatioString } from './AspectRatio';
// import { useConfiguration } from './ConfigurationProvider';

import { screenLargerThan } from 'views/style/util'
import { primaryColor1, white, likeColor, greenColor, } from 'views/style/colors';

import { selectors } from 'core/reducers/index';


function WebsiteCard({ websiteId }) {

  const website = useSelector(state => selectors.selectWebsite(state, websiteId));
  const url = website.url
  const displayUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
  return (
    <Card >
      <Link href={website.url}>
        <Title>{website.name}</Title>
      </Link>
      {/*<Link href={website.url}>*/}
        <UrlStyled>
          {/*<HideUrlPrefix url={website.url} />*/}
          {/*{displayUrl}*/}
          {website.url}
        </UrlStyled>
      {/*</Link>*/}
      {/*<iframe src={website.url}/>*/}

      <Flex>

          <div className="pre-Views" style={{width: `100%`, background: `#ddd`, height: `2px`, margin: `auto`}}>
            <div className="positive-Views" style={{width: `50%`, background: `#676abb`, height: `2px`}}>
            </div>
            {/*<span className="tooltiptext">1979/30</span>*/}
          </div>


        <br/>


        <LikedBtn
          likedByUser={website.is_liked}
          onClick={() => website.is_liked ? handleUnLikePhoto(website.id) : handleLikePhoto(website.id)}
          >
          <LikeIcon
            size={18}
            color={website.is_liked ? white : likeColor}
            hoverColor={website.is_liked ? white : likeColor}
          />
          <LikesCounter>{website.total_likes}</LikesCounter>
        </LikedBtn>
      </Flex>
      <Snippet
        dangerouslySetInnerHTML={{
          __html: website.snippet
        }}
      />
    </Card>
  );
}

const likedBtnStyles = props => `
  ${props.likedByUser ? `
    background-color: ${likeColor};
    color: ${white};
    &:hover {
      color: ${white};
      border-color: transparent !important;
    }
  ` : ''}
`;

const likedBtnGiantStyles = props => `
  ${props.likedByUser ? `
    svg {
      fill: ${likeColor};
      color: ${white};
    }
  ` : ''}
`;

const LikedBtn = styled(Button)`
border: 1px solid black;
  display: flex;
  align-items: center;
  margin: 0;
  ${likedBtnStyles}
  ${screenLargerThan.giant`
    flex-direction: column;
    height: auto;
    border: none;
    color: ${white} !important;
    background-color: transparent !important;
    svg {
      fill: ${white};
      color: ${white};
    }
    ${likedBtnGiantStyles}
    &:hover {
      color: ${white};
    }
  `};
`;
const LikesCounter = styled.span`
  margin: 0px 6px;
`;
const Flex = styled.div`
  display: flex;
  margin: auto;
`;
const UrlStyled = styled.div`
  color: green;
  font-family: arial,sans-serif;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* cursor: default; */
`
const Snippet = styled.div`
  font-family: arial,sans-serif;
  font-size: 14px;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.5;

  @media screen and (max-width: 768px) {
    font-size: 13px;
    line-height: 1.4;
  }
`
const Title = styled.div`
  font-family: arial,sans-serif;
  color: var(--titleColor);
  font-size: 18px;
  word-break: break-word;

  &:hover{
    text-decoration: underline;
  }

  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: var(--inputBg);
  border-radius: 11px;
  border: 1px solid black;
  margin-bottom: 1em;
  padding: 1em;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    padding: 12px;
    max-width: 100%;
  }
`

const Link = styled.a`
  text-decoration: none;
`

export default WebsiteCard;
