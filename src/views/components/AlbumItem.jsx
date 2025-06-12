import React from 'react';
import { withRouter} from 'react-router-dom';

import { connect, useSelector } from 'react-redux';
import styled from 'styled-components';

import BaseImage from 'views/components/BaseImage';
import BaseCard from 'views/components/BaseCard';


import RouterLink from 'views/components/RouterLink';
import ModalLink from 'views/components/ModalLink';


import BaseCardHeader from 'views/components/BaseCardHeader';
import MovieRatingTag from './MovieRatingTag';
import { getAspectRatioString } from './AspectRatio';
import { useConfiguration } from './ConfigurationProvider';



import Button from 'views/components/Button';
import LikeIcon from 'views/components/LikeIcon';
import {screenLargerThan} from 'views/style/util'
// import { likePhoto, unLikePhoto } from '../../actions/photo';

import { selectors } from 'core/reducers/index';
import { fetchLikeAlbum, fetchUnLikeAlbum } from 'core/actions';
import { primaryColor1, white, likeColor, greenColor, } from 'views/style/colors';




const LikedBtn = styled(Button)`
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
  ${screenLargerThan.tablet`
    flex-direction: column;
    height: auto;
    border: none;
    color: ${white} !important;
    background-color: red !important;
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

function AlbumItem({ albumId, subheader, handleLikePhoto, handleUnLikePhoto }) {
  // const classes = useStyles();
  const album = useSelector(state => selectors.selectAlbum(state, albumId));
  const { getImageUrl } = useConfiguration();

  // function renderItem(album) {
  //   if (!album.images) {
  //     return null;
  //   } else {
  //     return album.images[0].url;
  //
  //   }
  // }
  function renderItem(album) {
    if (album.images && album.images.length) {
      return album.images[2].url;
    } else {
      return null;

    }
  }

  // function renderItem(album) {
  //   // return album.images ? ({album.images[0].url}) : null;
  //
  //   return album.images && album.images.length ? (
  //       <img src={album.images[0].url} alt={album.name} />
  //   ) : null
  // }



  // return (
  //   // <ModalLink to={`/album/${albumId}`}>
  //
  //     <RouterLink className={classes.link} to={`/album/${albumId}`}>
  //       <BaseCard hasActionArea>
  //         <BaseImage
  //           src={album.images[0].url}
  //           alt={album.name}
  //           aspectRatio={getAspectRatioString(3, 3)}
  //         />
  //         <BaseCardHeader title={album.name} subheader={subheader} />
  //         <BaseCardHeader  subheader={subheader} />
  //       </BaseCard>
  //     </RouterLink>
  //   // </ModalLink>
  // );

  // return (
  //   // <ModalLink to={`/album/${albumId}`}>
  //
  //     <RouterLink className={classes.link} to={`/album/${albumId}`}>
  //       <BaseCard hasActionArea>
  //         <BaseImage
  //           src={getImageUrl(album.images)}
  //           alt={album.name}
  //           aspectRatio={getAspectRatioString(3, 3)}
  //         />
  //         <BaseCardHeader title={album.name} subheader={subheader} />
  //         <BaseCardHeader  subheader={subheader} />
  //       </BaseCard>
  //     </RouterLink>
  //   // </ModalLink>
  // );

  return (
    <ModalLink to={`/album/${albumId}`}>

      {/*<RouterLink className={classes.link} to={`/album/${albumId}`}>*/}
        <BaseCard hasActionArea>
          {/*<img src={URL.createObjectURL(src)} />*/}
          <BaseImage
            src={album.images[0] ? album.images[0].url : ""}
            alt={album.name}
            aspectRatio={getAspectRatioString(3, 3)}
          />
          {/*<BaseCardHeader title={album.name} subheader={subheader} />*/}
          <BaseCardHeader  subheader={subheader} />
          {/*<LikedBtn likedByUser={album.is_liked}
            onClick={() =>
              album.is_liked
                ? handleUnLikePhoto(album.id)
                : handleLikePhoto(album.id)
            }>
            <LikeIcon
              size={18}
              color={album.is_liked ? white : likeColor}
              hoverColor={album.is_liked ? white : likeColor}
            />
            <LikesCounter>{album.total_likes}</LikesCounter>
          </LikedBtn>*/}
        </BaseCard>
      {/*</RouterLink>*/}
    </ModalLink>
  );
}

// export default AlbumCard;


export default withRouter(
  connect(
    null,
    {
      // handleLikePhoto: likePhoto,
      // handleUnLikePhoto: unLikePhoto,
      handleLikePhoto: fetchLikeAlbum,
      handleUnLikePhoto: fetchUnLikeAlbum,
      // onPush: push,
    }
  )(AlbumItem)
);
