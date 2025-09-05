import React, { useEffect, } from 'react';
import { useSelector, connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';


// MATERIAL DONE
import { StyledTypography, StyledBox, StyledGrid } from 'views/styledComponents';


// VIEWS
import BaseImage from 'views/components/BaseImage';
import Introduktion from 'views/components/Introduktion';
import ImdbLogo from 'views/components/ImdbLogo';
import Button from 'views/components/Button';
import LikeIcon from 'views/components/LikeIcon';
// import PlaylistGenreChip from './PlaylistGenreChip';
// import Rating from './Rating';
import SongRow from './SongRow';

import { useConfiguration } from 'views/components/ConfigurationProvider';
import { getAspectRatioString } from 'views/components/AspectRatio';
import { primaryColor1, white, likeColor, greenColor, } from 'views/style/colors';
import { screenLargerThan } from 'views/style/util'

import useDocumentTitle from 'views/components/useDocumentTitle'



// CORE
import { selectors } from 'core/reducers/index';
// import { getPlaylistReleaseYear, getImdbProfileUrl } from 'core/utils';
// import { likePhoto, unLikePhoto } from '../../actions/photo';
import { fetchLikePlaylist, fetchUnLikePlaylist } from 'core/actions';



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

const ReStyledTypography = styled(StyledTypography)`
  color: ${props => props.theme.text};
`;
const ReBaseImage = styled.img`
  width: 10%;
`;

function PlaylistIntroduction({ playlistId, handleLikePhoto, handleUnLikePhoto }) {
  const playlist = useSelector(state => selectors.selectPlaylist(state, playlistId));
  const tracks = useSelector(state => selectors.selectPlaylistTracks(state, playlistId));
  // const classes = useStyles();

  // function handleLoadMore() {
  //   dispatch(fetchPopularMovies(nextPage));
  // }

  // const artists_title = playlist.artists.map((artist) => {
  //   artist.name+", "
  // })

  // useDocumentTitle(`${playlist.name} by `)
  // useDocumentTitle(playlist.name)
  // const title_name = playlist.name
  // useEffect(() => {
  //   document.title = title_name;
  // }, [title_name]);


  if (!playlist) {
    return null;
  }

  // const trackList = playlist.tracks.items.map((track) => {
  //   return (
  //     <li key={track.id}>
  //       <Link
  //         to={`/track/${track.track_uri}/`}
  //         style={{ color: '#FFF' }}
  //         >
  //         {track.name}
  //         {track.artists.map(artist => {
  //           artist.name
  //         })}
  //       </Link>
  //     </li>
  //   );
  // });

  // const linkList = playlist.ownner.map((artist) => {
  //   return (
  //     // <li key={artist.id}>
  //       <Link
  //         key={artist.id}
  //         to={`/artist/${artist.id}/`}
  //         style={{
  //           fontWeight: "bold",
  //           color: '#FFF',
  //           textDecoration: 'none',
  //           "&:hover": {
  //             textDecoration: "underline"
  //           }
  //         }}
  //         >
  //         {artist.name}, {'       '}
  //       </Link>
  //     // </li>
  //   );
  // });


  return (
    <Introduktion
      backgroundImageSrc={playlist.images[0] ? playlist.images[0].url : ""}
      imageSrc={
        <>
          <div flexBasis={100}>
            <ReBaseImage
              src={playlist.images[0] ? playlist.images[0].url : ""}
              aspectRatio={getAspectRatioString(1, 1)}
            />
          </div>
        </>
      }
      obj={playlist}
      title={
        <>
          <ReStyledTypography variant="h5" gutterBottom={!playlist.tagline}>
            {playlist.name} by {playlist.owner.display_name}


          </ReStyledTypography>
          {playlist.tagline && (
            <StyledTypography
              // className={classes.tagline}
              color="textSecondary"
              gutterBottom
            >
              {`"${playlist.tagline}"`}
            </StyledTypography>
          )}
        </>
      }
      content={
        <>
          <StyledGrid container spacing={2}>
            <StyledGrid item xs={12}>
              <StyledGrid display="flex" alignItems="center">
                {/*{playlist.tracks.items.map((item) => (
                  <SongRow
                    // playSong={playSong}
                    track={item.track}
                    />
                ))}*/}

              </StyledGrid>
            </StyledGrid>


          </StyledGrid>
        </>
      }
      likeButton={
        <>
          <LikedBtn likedByUser={playlist.is_liked}
            onClick={() =>
              playlist.is_liked
                ? handleUnLikePhoto(playlist)
                : handleLikePhoto(playlist)
            }>
            <LikeIcon
              size={18}
              color={playlist.is_liked ? white : likeColor}
              hoverColor={playlist.is_liked ? white : likeColor}
            />
            <LikesCounter>{playlist.total_likes}</LikesCounter>
          </LikedBtn>
        </>
      }
    />
  );
}

// export default PlaylistIntroduction;

export default withRouter(
  connect(
    null,
    {
      // handleLikePhoto: likePhoto,
      // handleUnLikePhoto: unLikePhoto,
      handleLikePhoto: fetchLikePlaylist,
      handleUnLikePhoto: fetchUnLikePlaylist,
      // onPush: push,
    }
  )(PlaylistIntroduction)
);
