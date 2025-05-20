import React from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import PopularMovies from "views/pages/PopularMovies";
import MovieProfile  from "views/pages/MovieProfile";

import AlbumProfile  from "views/pages/AlbumProfile";
import TrackProfile  from "views/pages/TrackProfile";
import PlaylistProfile  from "views/pages/PlaylistProfile";
import ArtistProfile  from "views/pages/ArtistProfile";
import LinksProfile  from "views/pages/LinksProfile";

import PersonProfile from "views/pages/PersonProfile";
import PopularPeople from "views/pages/PopularPeople";
import SearchResults from "views/pages/SearchResults";
import SwitchWithScrollRestoration from "views/components/SwitchWithScrollRestoration";

// V5
import ModalSwitch from "views/components/ModalSwitch";

// V6
// import ModalSwitch from "views/components/ModalRoutez";


import ModalCustom from "views/components/ModalCustom";
import ModalRoute  from "views/components/ModalRoute";
import ModalMovie  from "views/components/ModalMovie";

import MovieCard  from "views/components/MovieCard";

import LoginPage from "views/pages/LoginPage";

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
