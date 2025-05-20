import React from "react";
import { useSelector } from "react-redux";
import styled from 'styled-components';

import Button from 'views/components/Button';
import BaseImage from "views/components/BaseImage";
import BaseCard from "views/components/BaseCard";
import RouterLink from "views/components/RouterLink";
import ModalLink from "views/components/ModalLink";
import BaseCardHeader from "views/components/BaseCardHeader";
import LikeIcon from 'views/components/LikeIcon';
// import HideUrlPrefix from 'views/components/WebsiteCard/HideUrlPrefix';
// import { getAspectRatioString } from "./AspectRatio";
// import { useConfiguration } from "./ConfigurationProvider";

import { screenLargerThan } from "views/style/util"
import { primaryColor1, white, likeColor, greenColor, } from 'views/style/colors';

import { selectors } from "core/reducers/index";


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

const LikedBtn = styled(Button)`
border: 1px solid black;
  display: flex;
  align-items: center;
  margin: 0;
  ${props =>
    props.likedByUser &&
    `
    background-color: ${likeColor};
    color: ${white};
    &:hover {
      color: ${white};
      border-color: transparent !important;
    }
  `};
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
  font-size 14px;
  word-break: break-all;
  white-space: pre-wrap;
`
const Title = styled.div`
  font-family: arial,sans-serif;
  color: ${(props) => props.theme.titleColor};
  &:hover{
    text-decoration: underline;
  }
`
const Card = styled.div`
  width: 500px;
  background-color: ${(props) => props.theme.inputBg};
  border-radius: 11px;
  border: 1px solid black;
  margin-bottom: 1em;
  padding: 1em;
`
const Link = styled.a`
  text-decoration: none;
`

export default WebsiteCard;
