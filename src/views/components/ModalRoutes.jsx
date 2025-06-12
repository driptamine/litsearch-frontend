import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import PopularMovies from 'views/pages/PopularMovies';
import MovieProfile  from 'views/pages/PopularMovies';

import AlbumProfile  from 'views/pages/PopularMovies';
import TrackProfile  from 'views/pages/PopularMovies';
import PlaylistProfile  from 'views/pages/PopularMovies';
import ArtistProfile  from 'views/pages/PopularMovies';
import LinksProfile  from 'views/pages/PopularMovies';

import PersonProfile from 'views/pages/PopularMovies';
import PopularPeople from 'views/pages/PopularMovies';
import SearchResults from 'views/pages/PopularMovies';
import SwitchWithScrollRestoration from 'views/pages/PopularMovies';

// V5
// import ModalSwitch from 'views/pages/PopularMovies';
import ModalSwitch from 'views/pages/PopularMovies';

// V6
// import ModalSwitch from 'views/pages/PopularMovies';


import ModalCustom from 'views/pages/PopularMovies';
import ModalRoute  from 'views/pages/PopularMovies';
import ModalMovie  from 'views/pages/PopularMovies';

import MovieCard  from 'views/pages/PopularMovies';

import LoginPage from 'views/pages/PopularMovies';

function ModalRoutes({ stopSong, pauseSong, resumeSong, audioControl }) {
  // const location = useLocation();
  return (
    <ModalSwitch
      renderModal={({open, redirectToBack, location }) => (
        <ModalCustom open={open} scroll="body" onExited={redirectToBack} location={location}>
          {/*<ModalRoute defaultParentPath="/movies" path="/movies/:id" component={ModalMovie}/>*/}
          {/*<ModalRoute defaultParentPath="/movies" path="/movies/:movieId" component={MovieCard}/>*/}
          {/*<ModalRoute defaultParentPath="/movies" path="/movies/:movieId" component={MovieProfile}/>*/}
          <ModalRoute path="/login" component={LoginPage}/>
          <ModalRoute path="/movies/:movieId" component={MovieProfile}/>
          <ModalRoute path="/person/:personId" component={PersonProfile}/>
          <ModalRoute path="/album/:albumId" component={AlbumProfile}/>
          <ModalRoute path="/track/:trackId" component={TrackProfile}/>
          <ModalRoute path="/playlist/:playlistId" component={PlaylistProfile}/>
          <ModalRoute path="/artist/:artistId" component={ArtistProfile}/>
          <ModalRoute path="/links/:linkId" component={LinksProfile}/>


          {/*<ModalRoute  path="/video/:videoId" component={VideoProfile}/>*/}
        </ModalCustom>
      )}

      stopSong={stopSong}
      pauseSong={pauseSong}
      resumeSong={resumeSong}
      audioControl={audioControl}
    >

    </ModalSwitch>
  );
}

export default ModalRoutes;
