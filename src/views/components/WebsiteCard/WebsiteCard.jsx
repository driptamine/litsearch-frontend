import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { FaEye } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa';

import { IoHeartOutline } from 'react-icons/io5';
// import { PiHeartBold } from 'react-icons/pi';

import { RiDislikeLine } from 'react-icons/ri';

import { FaRegBookmark } from 'react-icons/fa';


import Button from 'views/components/Button';
import BaseImage from 'views/components/BaseImage';
import BaseCard from 'views/components/BaseCard';
import RouterLink from 'views/components/RouterLink';
import ModalLink from 'views/components/ModalLink';
import BaseCardHeader from 'views/components/BaseCardHeader';
import LikeIcon from 'views/components/LikeIcon';

import { screenLargerThan } from 'views/style/util'
import { primaryColor1, white, likeColor, greenColor, } from 'views/style/colors';

import { selectors } from 'core/reducers/index';


function WebsiteCard({ websiteId }) {

  const website = useSelector(state => selectors.selectWebsite(state, websiteId));
  const url = website.url
  const displayUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
  return (
    <Card >
      <Title>
        <Link href={website.url}>
           {website.title}
        </Link>
      </Title>
      {/*<Link href={website.url}>*/}
        <UrlStyled>
          {/*<HideUrlPrefix url={website.url} />*/}
          {/*{displayUrl}*/}
          {website.url}
        </UrlStyled>
      {/*</Link>*/}
      {/*<iframe src={website.url}/>*/}

      <RatioIndicator className="Previews">

          <div className="pre-Views" style={{width: `100%`, background: `#ddd`, height: `2px`, margin: `auto`}}>
            <div className="positive-Views" style={{width: `80%`, background: `#676abb`, height: `2px`}}>
            </div>
            {/*<span className="tooltiptext">1979/30</span>*/}
          </div>


        <br/>



      </RatioIndicator>

      <Snippet
        dangerouslySetInnerHTML={{
          __html: website.description
        }}
      />

      <Line />

      <Stats>

        <ViewsCounter>
          <FaEye />
          <Count>187,1K</Count>
        </ViewsCounter>

        {/*<LikedBtn
          likedByUser={website.is_liked}
          onClick={() => website.is_liked ? handleUnLikePhoto(website.id) : handleLikePhoto(website.id)}
          >
          <LikeIcon
            size={18}
            color={website.is_liked ? white : likeColor}
            hoverColor={website.is_liked ? white : likeColor}
          />
          <LikesCounter>{website.total_likes}</LikesCounter>
        </LikedBtn>*/}

        <LikesCounter>
          <IoHeartOutline
            size={21}
            style={{ strokeWidth: '60px' }}
            />
          {/*<PiHeartBold />*/}
          <Count>1270</Count>
        </LikesCounter>

        <DislikesCounter>
          <RiDislikeLine />
          <Count>200</Count>
        </DislikesCounter>

        <CommentsCounter>
          <FaRegComment />
          <Count>300</Count>
        </CommentsCounter>

        <BookmarksCounter>
          <FaRegBookmark />
          <Count>491</Count>
        </BookmarksCounter>




      </Stats>

    </Card>
  );
}

const Line = styled.div`
  margin-top: 20px;
  margin-bottom: 5px;
  width: 100%;
  background: #ddd;
  height: 1px;

`;
const Stats = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ViewsCounter = styled.div`
  display: flex;
  align-items: center;

  padding: 10px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.attachmentColor};
  }
`;
const CommentsCounter = styled.div`
  display: flex;
  align-items: center;

  padding: 10px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.attachmentColor};
  }
`;
const LikesCounter = styled.div`
  display: flex;
  align-items: center;

  padding: 10px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.attachmentColor};
  }
`;

const DislikesCounter = styled.div`
  display: flex;
  align-items: center;

  padding: 10px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.attachmentColor};
  }
`;
const BookmarksCounter = styled.div`
  display: flex;
  align-items: center;

  padding: 10px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.attachmentColor};
  }
`;
const WrapperCounter = styled.div`
  display: flex;
  align-items: center;

  padding: 10px;
  border-radius: 5px;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.attachmentColor};
  }
`;
const Count = styled.span`
  margin-left: 3px;
  user-select: none;
  font-family: Verdana;
  /* font-size: 16px; */
`;

const LikedBtn = styled(Button)`
  border: 1px solid black;
  display: flex;
  align-items: center;
  margin: 0;
  ${props => props.likedByUser && `
    background-color: ${likeColor};
    color: ${white};
    &:hover {
      color: ${white};
      border-color: transparent !important;
    }
  `}

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
    ${props =>
      props.likedByUser &&
      `
        svg {
          fill: ${likeColor};
          color: ${white};
        }
      `};
    &:hover {
      color: ${white};
    }
  `};
`;
// const LikesCounter = styled.span`
//   margin: 0px 6px;
// `;
const RatioIndicator = styled.div`
  display: flex;
  margin: auto;
`;
const UrlStyled = styled.div`
  color: ${(props) => props.theme.urlColor};
  font-family: arial,sans-serif;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* cursor: default; */
`
const Snippet = styled.div`
  font-family: arial,sans-serif;
  font-size 14px;
  word-break: break-all;
  white-space: pre-wrap;
`

const Title = styled.div`
  font-family: arial,sans-serif;
  color: ${(props) => props.theme.titleColor};
  &:hover{
    text-decoration: underline;
    text-decoration-color: ${(props) => props.theme.titleColor};
  }
`
const Card = styled.div`
  width: 550px;
  background-color: ${(props) => props.theme.inputBg};
  border-radius: 11px;
  border: 1px solid black;
  margin-bottom: 1em;
  padding: 1em;
`
const Link = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.titleColor};
`

export default WebsiteCard;
