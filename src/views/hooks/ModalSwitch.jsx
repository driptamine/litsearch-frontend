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
import ChunkUpload from 'core/hooks/useScrollMemory';
import MediaUploader from 'core/hooks/useScrollMemory';
import PostCreator from 'core/hooks/useScrollMemory';

// MODALS (these are typically rendered by ModalRoute, not directly here)
import ModalMovies from 'core/hooks/useScrollMemory';
import ModalPosts from 'core/hooks/useScrollMemory';
import ModalPeople from 'core/hooks/useScrollMemory';
import ModalMagazines from 'core/hooks/useScrollMemory';
import ModalAlbums from 'core/hooks/useScrollMemory';

// PAGES
import LoginPage from 'core/hooks/useScrollMemory';
// import LoginPage from 'core/hooks/useScrollMemory';
import SignUpPage from 'core/hooks/useScrollMemory';
import SearchAppp from 'core/hooks/useScrollMemory';
import TwitchAuthCallback from 'core/hooks/useScrollMemory';
import GoogleAuthCallback from 'core/hooks/useScrollMemory';

import MovieProfile from 'core/hooks/useScrollMemory';
import PersonProfile from 'core/hooks/useScrollMemory';
import ArtistProfile from 'core/hooks/useScrollMemory';
import AlbumProfile from 'core/hooks/useScrollMemory';
import PlaylistProfile from 'core/hooks/useScrollMemory';
import TrackProfile from 'core/hooks/useScrollMemory';
import LinksProfile from 'core/hooks/useScrollMemory';
import SearchResults from 'core/hooks/useScrollMemory';

import TrackListLoopV2 from 'core/hooks/useScrollMemory';
import TrackListLoopV1 from 'core/hooks/useScrollMemory';

import { VideoFeedProfile } from 'core/hooks/useScrollMemory';
import { VideoFeed } from 'core/hooks/useScrollMemory';
import { VideoFeedV2 } from 'core/hooks/useScrollMemory';
import { PhotosPage } from 'core/hooks/useScrollMemory';
import { PhotosPageUnsplash } from 'core/hooks/useScrollMemory';
import VideoProfile from 'core/hooks/useScrollMemory';

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
