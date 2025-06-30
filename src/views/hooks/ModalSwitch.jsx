// https://gemini.google.com/app/e0d29882a4ef4d7b?hl=en
import React, { useEffect, useMemo } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

// Hooks
import { useModalSwitchLogic } from 'views/hooks/useModalSwitchLogic';
import useScrollMemory from 'core/hooks/useScrollMemory'; // Keep if still needed for scroll

// CORE
import { getState } from 'core/store'; // To get auth state

// CHAT
import ChatList from 'views/pages/ChatV3/Left/ChatList';
import ChatWindow from 'views/pages/ChatV3/Main/ChatWindow';
import ChatWindowGemini from 'views/pages/ChatGemini/Main/ChatWindow';
import chatsData from 'views/pages/ChatV3/chatsV2.json';
import emojiData from 'views/pages/ChatV3/emoji.json';

// UPLOAD
// import ChunkUpload from 'views/components/upload/ChunkUpload';
// import MediaUploader from 'views/components/upload/MediaUploader';
// import PostCreator from 'views/components/upload/uploader/posts/PostCreator';

// MODALS (these are typically rendered by ModalRoute, not directly here)
// import ModalMovies from 'views/components/ModalMovies';
// import ModalPosts from 'views/pages/PopularPosts/ModalPosts';
// import ModalPeople from 'views/components/ModalPeople';
// import ModalMagazines from 'views/components/ModalMagazines';
// import ModalAlbums from 'views/components/ModalAlbums';

// PAGES
// import LoginPage from 'views/pages/LoginPage/indexV2';
// // import LoginPage from 'views/pages/LoginPage/index';
// import SignUpPage from 'views/pages/SignUpPage';
// import SearchAppp from 'views/pages/MainSearch/StartPage/App';
// import TwitchAuthCallback from 'views/pages/Auth/TwitchAuthCallback';
// import GoogleAuthCallback from 'views/pages/Auth/GoogleAuthCallback';
//
// import MovieProfile from 'views/pages/MovieProfile';
// import PersonProfile from 'views/pages/PersonProfile';
// import ArtistProfile from 'views/pages/ArtistProfile';
// import AlbumProfile from 'views/pages/AlbumProfile';
// import PlaylistProfile from 'views/pages/PlaylistProfile';
// import TrackProfile from 'views/pages/TrackProfile';
// import LinksProfile from 'views/pages/LinksProfile';
// import SearchResults from 'views/pages/SearchResults';
//
// import TrackListLoopV2 from 'views/pages/PopularMusic/indexV2';
// import TrackListLoopV1 from 'views/pages/PopularMusic/index';
//
// import { VideoFeedProfile } from 'views/pages/VideoFeedProfile';
// import { VideoFeed } from 'views/pages/VideoFeedProfile/VideoFeed';
// import { VideoFeedV2 } from 'views/pages/VideoFeedProfile/VideoFeedV2';
// import { PhotosPage } from 'src/views/pages/PhotosPage/PhotosPage';
// import { PhotosPageUnsplash } from 'views/pages/PhotosPage/PhotosPageUnsplash';
// import VideoProfile from 'views/pages/VideoProfile';

// UPLOAD - Restored original paths
import ChunkUpload from 'views/components/upload/ChunkUpload'; // Changed to single quotes
import MediaUploader from 'views/components/upload/MediaUploader'; // Changed to single quotes
import PostCreator from 'views/components/upload/uploader/posts/PostCreator'; // Changed to single quotes

// MODALS - Restored original paths (these are typically rendered by ModalRoute, but their imports are needed if directly used or passed down)
import ModalMovies from 'views/components/ModalMovies'; // Changed to single quotes
import ModalPosts from 'views/pages/PopularPosts/ModalPosts'; // Changed to single quotes
import ModalPeople from 'views/components/ModalPeople'; // Changed to single quotes
import ModalMagazines from 'views/components/ModalMagazines'; // Changed to single quotes
import ModalAlbums from 'views/components/ModalAlbums'; // Changed to single quotes

// PAGES - Restored original paths
import LoginPage from 'views/pages/LoginPage/indexV2'; // Changed to single quotes
import SignUpPage from 'views/pages/SignUpPage'; // Changed to single quotes
import SearchAppp from 'views/pages/MainSearch/StartPage/App'; // Changed to single quotes
import TwitchAuthCallback from 'views/pages/Auth/TwitchAuthCallback'; // Changed to single quotes
import GoogleAuthCallback from 'views/pages/Auth/GoogleAuthCallback'; // Changed to single quotes

import MovieProfile from 'views/pages/MovieProfile'; // Changed to single quotes
import PersonProfile from 'views/pages/PersonProfile'; // Changed to single quotes
import ArtistProfile from 'views/pages/ArtistProfile'; // Changed to single quotes
import AlbumProfile from 'views/pages/AlbumProfile'; // Changed to single quotes
import PlaylistProfile from 'views/pages/PlaylistProfile'; // Changed to single quotes
import TrackProfile from 'views/pages/TrackProfile'; // Changed to single quotes
import LinksProfile from 'views/pages/LinksProfile'; // Changed to single quotes
import SearchResults from 'views/pages/SearchResults'; // Changed to single quotes
import SearchesResults from 'views/pages/SearchResults'; // Changed to single quotes

import TrackListLoopV2 from 'views/pages/PopularMusic/indexV2'; // Changed to single quotes
import TrackListLoopV1 from 'views/pages/PopularMusic/index'; // Changed to single quotes

import { VideoFeedProfile } from 'views/pages/VideoFeedProfile'; // Changed to single quotes
import { VideoFeed } from 'views/pages/VideoFeedProfile/VideoFeed'; // Changed to single quotes
import { VideoFeedV2 } from 'views/pages/VideoFeedProfile/VideoFeedV2'; // Changed to single quotes
import VideoProfile from 'views/pages/VideoProfile'; // Changed to single quotes
import { PhotosPage } from 'src/views/pages/PhotosPage/PhotosPage';
import { PhotosPageUnsplash } from 'views/pages/PhotosPage/PhotosPageUnsplash';
import  NoteApp  from 'views/pages/NoteText/NoteApp';
import  NoteTakingApp  from 'views/pages/NoteApp/NoteTakingApp';

export const ModalRouteContext = React.createContext();

function ModalSwitch({ children, renderModal, stopSong, pauseSong, resumeSong, audioControl }) {
  const { isModal, switchLocation, contextValue, pathname } = useModalSwitchLogic();
  useScrollMemory(); // Keep if you still need scroll memory

  const auth = getState().users.access_token;
  const showChatList = pathname.startsWith('/chat');

  return (
    <ModalRouteContext.Provider value={contextValue}>
      {showChatList && <ChatList users={chatsData.users} messages={chatsData.messages} emojiData={emojiData} />}
      <Switch location={switchLocation}>
        {/* Authentication Routes */}
        <Route path="/login" render={props => auth ? (<Redirect to={{ pathname: '/feed', }} />) : (<LoginPage {...props} />)} />
        <Route path="/signup" render={props => auth ? (<Redirect to={{ pathname: '/feed', }} />) : (<SignUpPage {...props} />)} />
        <Route path="/auth/twitch/callback" component={TwitchAuthCallback} />
        <Route path="/auth/google/callback" component={GoogleAuthCallback} />

        {/* Upload Routes */}
        <Route exact path="/cu" component={ChunkUpload} />
        <Route exact path="/ax" component={PostCreator} />
        <Route exact path="/s3upload" component={MediaUploader} />
        <Route exact path="/create" component={PostCreator} />

        {/* Feed/Browse Routes */}
        <Route exact path="/movies" component={ModalMovies} />
        <Route exact path="/feed" component={ModalMovies} /> {/* Consider if /movies and /feed should be the same */}
        <Route exact path="/feedV2" component={ModalPosts} />
        <Route exact path="/people" component={ModalPeople} />
        <Route exact path="/magazines" component={ModalMagazines} />
        <Route exact path="/albums" component={ModalAlbums} />
        <Route exact path="/" component={SearchAppp} /> {/* Homepage */}

        {/* Chat Routes */}
        <Route exact path="/chat/:userId" component={ChatWindow} />
        <Route exact path="/wow" component={ChatWindowGemini} />

        {/* Music Routes */}
        <Route exact path="/musicv2" component={TrackListLoopV2} /> {/* Assuming TrackListLoopV2 is imported somewhere or defined here */}
        <Route exact path="/musicv1" component={TrackListLoopV1} /> {/* Same for TrackListLoopV1 */}

        {/* Search Routes */}
        <Route exact path="/search/:searchType" component={SearchResults} />
        <Route exact path="/searches/:query" component={SearchResults} /> {/* Consider combining /search and /searches */}
        <Route exact path="/searches/:type/:query" component={SearchResults} />

        {/* Profile Routes (can receive audio control props if needed by component) */}
        <Route path="/movies/:movieId" component={MovieProfile} />
        <Route path="/person/:personId" component={PersonProfile} />
        <Route path="/artist/:artistId">
          <ArtistProfile stopSong={stopSong} pauseSong={pauseSong} resumeSong={resumeSong} audioControl={audioControl} />
        </Route>
        <Route path="/album/:albumId">
          <AlbumProfile stopSong={stopSong} pauseSong={pauseSong} resumeSong={resumeSong} audioControl={audioControl} />
        </Route>
        <Route path="/playlist/:playlistId">
          <PlaylistProfile stopSong={stopSong} pauseSong={pauseSong} resumeSong={resumeSong} audioControl={audioControl} />
        </Route>
        <Route path="/links/:linkId">
          <LinksProfile stopSong={stopSong} pauseSong={pauseSong} resumeSong={resumeSong} audioControl={audioControl} />
        </Route>
        <Route path="/track/:trackId" component={TrackProfile} />
        <Route path="/video/:videoId" component={VideoProfile} />
        <Route path="/vine/:videoId" component={VideoProfile} /> {/* Duplicate, consider consolidating if same behavior */}

        {/* Feed Routes */}
        <Route path="/videos" component={VideoFeedV2} />
        <Route path="/videofeed" component={VideoFeedProfile} /> {/* Assuming VideoFeedProfile is imported */}
        <Route path="/photos" component={PhotosPageUnsplash} />
        {/*<Route path="/notes" component={NoteApp} />*/}
        <Route path="/notes" component={NoteTakingApp} />

        {/* Catch-all for unhandled routes, consider if needed */}
        {/* <Route path="*"><Redirect to="/movies" /> </Route> */}
      </Switch>

      {isModal && renderModal({
          open: isModal,
          redirectToBack: contextValue.redirectToBack,
          location: contextValue.backgroundLocation
      })}
    </ModalRouteContext.Provider>
  );
}

// Styled components
const FlexDiv = styled.div``;
const ChatAppContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export default ModalSwitch;
