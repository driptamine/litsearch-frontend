import React, { Suspense } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { lazyImport } from 'core/utils/lazyImport';

const PopularMovies = lazyImport(() => import('views/pages/PopularMovies'));
const MovieProfile  = lazyImport(() => import('views/pages/MovieProfile'));
const AlbumProfile  = lazyImport(() => import('views/pages/AlbumProfile'));
const TrackProfile  = lazyImport(() => import('views/pages/TrackProfile'));
const PostProfile  = lazyImport(() => import('views/pages/PostProfile'));
const PostCreatorSection  = lazyImport(() => import('views/pages/PostCreatorSection'));
const PlaylistProfile  = lazyImport(() => import('views/pages/PlaylistProfile'));
const ArtistProfile  = lazyImport(() => import('views/pages/ArtistProfile'));
const LinksProfile  = lazyImport(() => import('views/pages/LinksProfile'));
const PersonProfile = lazyImport(() => import('views/pages/PersonProfile'));
const PopularPeople = lazyImport(() => import('views/pages/PopularPeople'));
const SearchResults = lazyImport(() => import('views/pages/SearchResults'));
const LoginPage = lazyImport(() => import('views/pages/LoginPage'));

import SwitchWithScrollRestoration from 'views/components/SwitchWithScrollRestoration';
import ModalSwitch from 'views/hooks/ModalSwitch';
import ModalCustom from 'views/components/ModalCustom';
import ModalRoute  from 'views/components/ModalRoute';
import ModalMovie  from 'views/components/ModalMovie';
import MovieCard  from 'views/components/MovieCard';

import PageLoader from 'views/components/PageLoader';

function ModalRoutes({ stopSong, pauseSong, resumeSong, audioControl }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ModalSwitch
        renderModal={({ open, redirectToBack, location }) => (
          <ModalCustom open={open} scroll="body" onExited={redirectToBack} location={location}>
            <ModalRoute path="/login" component={LoginPage}/>
            <ModalRoute path="/movies/:movieId" component={MovieProfile}/>
            <ModalRoute path="/posts/:postId" component={PostProfile}/>
            <ModalRoute path="/person/:personId" component={PersonProfile}/>
            <ModalRoute path="/album/:albumId" component={AlbumProfile}/>
            <ModalRoute path="/track/:trackId" component={TrackProfile}/>
            <ModalRoute path="/playlist/:playlistId" component={PlaylistProfile}/>
            <ModalRoute path="/artist/:artistId" component={ArtistProfile}/>
            <ModalRoute path="/links/:linkId" component={LinksProfile}/>
            <ModalRoute exact path="/create_post" component={PostCreatorSection}/>
          </ModalCustom>
        )}

        stopSong={stopSong}
        pauseSong={pauseSong}
        resumeSong={resumeSong}
        audioControl={audioControl}
      >

      </ModalSwitch>
    </Suspense>
  );
}

export default ModalRoutes;
