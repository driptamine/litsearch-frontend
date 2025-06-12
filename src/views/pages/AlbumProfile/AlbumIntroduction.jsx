import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';

// MATERIAL DONE
// import { Typography, Box, Grid, makeStyles } from '@mui/material';
import { StyledTypography, StyledBox, StyledGrid } from 'views/styledComponents';
// import { Typography, makeStyles, Box, Grid, Link } from '@mui/material';
// import { makeStyles, Box, Typography } from '@mui/material';

import Rating from './Rating';
import Introduktion from 'views/components/Introduktion';
// import ImdbLogo from 'views/components/ImdbLogo';
import AlbumGenreChip from './AlbumGenreChip';
import BaseImage from 'views/components/BaseImage';
import Button from 'views/components/Button';
import LikeIcon from 'views/components/LikeIcon';
import Comment from './Comment';
import CommentV2 from './CommentV2';
import CommentV3 from './CommentV3';
import CommentV4 from './CommentV4';

// import useDocumentTitle from 'views/components/useDocumentTitle'

import { getAspectRatioString } from 'views/components/AspectRatio';
import { useConfiguration } from 'views/components/ConfigurationProvider';

import { screenLargerThan } from 'views/style/util'
import { primaryColor1, white, likeColor, greenColor, } from 'views/style/colors';

// CORE
import { selectors } from 'core/reducers/index';
// import { likePhoto, unLikePhoto } from '../../actions/photo';
import useDocumentTitle from 'core/hooks2/useDocumentTitle'
import { fetchLikeAlbum, fetchUnLikeAlbum } from 'core/actions';


// import { getAlbumReleaseYear, getImdbProfileUrl } from 'core/utils';


// const useStyles = makeStyles(theme => ({
//   year: {
//     color: theme.palette.text.secondary
//   },
//   tagline: {
//     fontStyle: "italic"
//   },
//   genreChip: {
//     margin: theme.spacing(0.5)
//   },
//   overview: {
//     whiteSpace: "pre-wrap"
//   }
// }));




const LikedBtn = styled(Button)`
  display: flex;
  align-items: center;
  margin: 0;
  ${props => props.likedByUser &&
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

const StyledImg = styled.img`
  width: 400px;
`;
const ReStyledTypography = styled.p`
  color: #673ab7;
  font-family: Verdana;
`;
const Section = styled.div`
  margin-top: 1em;
`;

function AlbumIntroduction({ albumId, handleLikePhoto, handleUnLikePhoto }) {
  const album = useSelector(state => selectors.selectAlbum(state, albumId));
  // const classes = useStyles();

  // useDocumentTitle(album.name);
  function intersperse(arr, sep) {
      if (arr.length === 0) {
          return [];
      }

      return arr.slice(1).reduce(function(xs, x, i) {
          return xs.concat([sep, x]);
      }, [arr[0]]);
  }

  // var artistz = album.artists.map((artist, i) =>
  //     return (
  //       <Tag key={i} tag={item.tags[i]} />
  //     )
  //     return (
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
  //         {/*{artist.name.join(", ")} -{" "}*/}
  //       </Link>
  //     )
  // };
  // artistz = intersperse(artistz, ", ");

  // const releaseYear = getAlbumReleaseYear(album);

  // function handleLoadMore() {
  //   dispatch(fetchPopularMovies(nextPage));
  // }
  // const artists_title = album.artists.map((artist) => {
  //   artist.name+", "
  // })

  // useDocumentTitle(`${album.name} by `)
  // const title_name = album.name
  // useEffect(() => {
  //   document.title = title_name;
  // }, [title_name]);
  //
  if (!album) {
    return null;
  }

  // const trackList = album.tracks.items.map((track) => {
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
  const linkList = album.artists.map((artist) => {
    return (
      // <li key={artist.id}>
        <Link
          key={artist.id}
          to={`/artist/${artist.id}/`}
          style={{
            fontWeight: "bold",
            color: '#FFF',
            textDecoration: 'none',
            "&:hover": {
              textDecoration: "underline"
            }
          }}
          >
          {artist.name}, {'       '}
          {/*{artist.name.join(", ")} -{" "}*/}
        </Link>
      // </li>
    );
  }).join();

  const comments = [
    {
      id: 1,
      userpic: '',
      username: '',
      text: '“The best place to hide is in plain sight.”– Edgar Allan Poe, (The Purloined Letter)',
      replies: [
        {
          id: 2,
          userpic: '',
          username: '',
          text: 'I had to read that short story for a sociology seminar. Pretty good read!',
          replies: [
            {
              id: 3,
              userpic: '',
              username: '',
              text: 'I read it in 6th grade because it was one of the highest “reading level” books while not being forever long. I passed the comprehension test to my teachers delight and I found Edgar Allan Poe.',
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      userpic: '',
      username: '',
      text: 'How is this possible?.',
      replies: [
        {
          id: 2,
          userpic: '',
          username: '',
          text: `
          OP’s title is inaccurate, that’s why.

          Escobar did not become wanted in the United States until the late 1980s. He wouldn’t have had any restrictions traveling to and around the US in 1981.
          `,
          replies: [
            {
              id: 3,
              userpic: '',
              username: '',
              text: 'BREAK OUT THE PITCHFORKS, STAT!',
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      userpic: '',
      username: '',
      text: `He wasn't that notable to the US when this picture was taken`,
      replies: [
        {
          id: 2,
          userpic: '',
          username: '',
          text: `Although he was a criminal by 1981, he wasn't even wanted in Colombia at that time, much less the U.S.`,
          replies: [
            {
              id: 3,
              userpic: '',
              username: '',
              text: `Poor guy nobody wanted him :(`,
              replies: [],
            },
          ],
        },
        {
          id: 2,
          userpic: '',
          username: '',
          text: `Don't let reality ruin a good reddit clickbait.`,
          replies: [
            {
              id: 3,
              userpic: '',
              username: '',
              text: `this app is being held together by the same couple dozen of reposts everyday`,
              replies: [],
            },
          ],
        },
      ],
    },
  ];


  return (
    <Introduktion
      obj={album}
      backgroundImageSrc={album.images[0] ? album.images[0].url : ""}
      imageSrc={
        <>
          <StyledBox flexBasis={500}>
            <StyledImg

              src={album.images[0] ? album.images[0].url : ""}
              aspectRatio={getAspectRatioString(1, 1)}
            />
          </StyledBox>
        </>
      }
      title={
        <>
          <ReStyledTypography variant="h5" gutterBottom={!album.tagline}>
            {album.name} by {album.artists.map((artist, i) =>
                <span key={i}>
                  {i > 0 && ", "}
                  <Link
                    to={`/artist/${artist.id}/`}
                    style={{
                      fontWeight: "bold",
                      color: '#FFF',
                      textDecoration: 'none',
                      "&:hover": {
                        textDecoration: "underline"
                      }
                    }}
                    >

                    {artist.name}
                  </Link>
                </span>
              )
            }
            {/*{linkList}*/}


          </ReStyledTypography>
          {album.tagline && (
            <StyledTypography
              // className={classes.tagline}
              color="textSecondary"
              gutterBottom
            >
              {`"${album.tagline}"`}
            </StyledTypography>
          )}
        </>
      }
      content={
        <>
          <StyledGrid container spacing={2}>
            <StyledGrid item xs={12}>
              <StyledBox display="flex" alignItems="center">
                {/*<Rating value={album.vote_average * 10} />
                <Box marginLeft={2}>
                  <Link
                    href={getImdbProfileUrl(album.imdb_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ImdbLogo />
                  </Link>
                </Box>*/}
                {/*{linkList}*/}

                {/*<ul>{trackList}</ul>*/}
                {/*<Link
                  to={`/artist/${album.artists[0].artist_uri}`}

                  >
                  {
                    album.artists[0].name}
                </Link>*/}
              </StyledBox>
            </StyledGrid>


          </StyledGrid>
        </>
      }
      likeButton={
        <>
          <LikedBtn likedByUser={album.is_liked}
            onClick={() =>
              album.is_liked
                ? handleUnLikePhoto(album)
                : handleLikePhoto(album)
            }>
            <LikeIcon
              size={18}
              color={album.is_liked ? white : likeColor}
              hoverColor={album.is_liked ? white : likeColor}
            />
            <LikesCounter>{album.total_likes}</LikesCounter>
          </LikedBtn>
        </>
      }
      commentSection={
        <Section>
          {comments.map((comment) => (
            <CommentV4 key={comment.id} comment={comment} />
          ))}
        </Section>
      }
    />
  );
}

// export default AlbumIntroduction;

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
  )(AlbumIntroduction)
);
