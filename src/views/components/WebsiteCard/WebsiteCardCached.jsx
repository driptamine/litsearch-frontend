import React from "react";
import { useSelector } from "react-redux";
import styled from 'styled-components';

// MATERIAL DONE
// import { makeStyles } from "@mui/material/styles";
import BaseImage from "views/components/BaseImage";
import BaseCard from "views/components/BaseCard";
import RouterLink from "views/components/RouterLink";
import ModalLink from "views/components/ModalLink";
import BaseCardHeader from "views/components/BaseCardHeader";

import { getAspectRatioString } from "./AspectRatio";
import { useConfiguration } from "./ConfigurationProvider";

import { selectors } from "core/reducers/index";


function WebsiteCardCached({ websiteId }) {

  const website = useSelector(state => selectors.selectWebsite(state, websiteId));

  return (
    <Card >
      {/*<RouterLink className={classes.link} to={`/movie/${movieId}`}>*/}
        {/*<BaseCard hasActionArea>*/}
          <Link href={website.url}>
            <Title>{website.title}</Title>
          </Link>
          {/*<Link href={website.url}>*/}
            <UrlStyled>
              {website.url}
            </UrlStyled>
          {/*</Link>*/}
          {/*<iframe src={website.url}/>*/}
          <br/>
          <div className="track-previews">
            <div className="pre-Views" style={{width: `100%`, background: `#ddd`, height: `2px`}}>
              <div className="positive-Views" style={{width: `50%`, background: `#676abb`, height: `2px`}}>
              </div>
              {/*<span className="tooltiptext">1979/30</span>*/}
            </div>
          </div><br/>

          <div
            dangerouslySetInnerHTML={{
              __html: website.scrapped
            }}
          />

          {/*<Snippet>
            {website.description}
          </Snippet>*/}


          {/*<BaseCardHeader title={movie.title} subheader={subheader} />*/}
        {/*</BaseCard>*/}
      {/*</RouterLink>*/}
    </Card>
  );
}


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
