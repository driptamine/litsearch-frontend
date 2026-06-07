import React from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@linaria/react';

import BaseImage from 'views/components/BaseImage';
import BaseCard from 'views/components/BaseCard';
import RouterLink from 'views/components/RouterLink';
import ModalLink from 'views/components/ModalLink';
import BaseCardHeader from 'views/components/BaseCardHeader';
// import ImageRatingTag from './ImageRatingTag';
import { getAspectRatioString } from './AspectRatio';
import { useConfiguration } from './ConfigurationProvider';

import { selectors } from 'core/reducers/index';


function ImageCardBrave({ imageId }) {
  // const classes = useStyles();
  const image = useSelector(state => selectors.selectImage(state, imageId));
  const { getImageUrl } = useConfiguration();

  if (!image) return null;

  return (
    <Wrapper onError={i => i.target.style.display='none'} >
    {/*<ImageWrapper>*/}
      {/*<ModalLink to={`/website=${image.url}`}>*/}

        {/*<RouterLink className={classes.link} to={`/image/${imageId}`}>*/}



            <ImgStyled
              src={image.thumbnail?.src}
              onError={i => i.target.style.display='none'}
            />



        {/*</RouterLink>*/}
      {/*</ModalLink>*/}
    {/*</ImageWrapper>*/}

    <Flex>
      {/*<Favicon src={image.meta_url.favicon}/>*/}
      <Source>
        <StyledLink href={image.url} target="_blank">
          <TextWrapper>
            {image.source}
          </TextWrapper>
        </StyledLink>
      </Source>
    </Flex>

    <Description>
      {/*<StyledLink href={image.url} target="_blank">*/}
        <TextWrapper>
          {image.title}
        </TextWrapper>
      {/*</StyledLink>*/}
    </Description>
    </Wrapper>
  );
}

const Flex = styled.div`
  display: flex;
  margin-left: 6px;
`;
const Description = styled.div`
  color: #474747;
  font-family: arial,sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: .2px;
  margin-bottom: 0;
  margin-left: 6px;
  /* white-space: nowrap; */

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 12px);
`;
const Source = styled.div`
  color: #474747;
  font-family: arial,sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: .2px;
  margin-bottom: 0;
  margin-left: 6px;
  /* white-space: nowrap; */

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100% - 12px);
`;
const Wrapper = styled.div`
  /* padding: 1em; */
  padding-bottom: 1em;
  margin: 10px;
  background: var(--imageCardColor) ;

  border-radius: 7px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  box-sizing: border-box;

  @media screen and (max-width: 600px) {
    flex-basis: calc(50% - 20px);
  }

  @media screen and (max-width: 400px) {
    flex-basis: 100%;
    margin: 10px 0;
  }

`;
const TextWrapper = styled.div`
  color: var(--imageTitleColor) ;
  font-family: Verdana;
  width: 100%;
`;
const ImgStyled = styled.img`
  // cursor: pointer;
  width: auto;
  height: 180px;
  margin: auto;

  @media screen and (max-width: 600px) {
    width: 100%;
    object-fit: cover;
    border-radius: 7px 7px 0 0;
  }
`;
const ImageWrapper = styled.div`
  right: 0;
  margin: auto;
`;
const Favicon = styled.img`
  margin-top: auto;
  margin-bottom: auto;
  width: 12px;
  height: 12px;
`;

const StyledLink = styled.a`
  color: var(--imageTitleColor) ;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  font-family: Verdana;
`;
export default ImageCardBrave;
