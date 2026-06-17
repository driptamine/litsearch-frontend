import React, { useEffect, useMemo, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { styled } from '@linaria/react';

// Hooks
import { useModalSwitchLogic } from 'views/hooks/useModalSwitchLogic';
import useScrollMemory from 'core/hooks/useScrollMemory';

// CORE
import { getState } from 'core/store';
import { lazyImport } from 'core/utils/lazyImport';

// CHAT
const ChatList = lazyImport(() => import('views/pages/ChatV3/Left/ChatList'));
const ChatWindow = lazyImport(() => import('views/pages/ChatV3/Main/ChatWindow'));
const ChatWindowGemini = lazyImport(() => import('views/pages/ChatGemini/Main/ChatWindow'));
import emojiData from 'views/pages/ChatV3/emoji.json';

// UPLOAD
const ChunkUpload = lazyImport(() => import('views/components/upload/ChunkUpload'));
const MediaUploader = lazyImport(() => import('views/components/upload/MediaUploader'));
const PostCreator = lazyImport(() => import('views/components/upload/uploader/posts/PostCreator'));

// MODALS
const ModalMovies = lazyImport(() => import('views/components/ModalMovies'));
const ModalPosts = lazyImport(() => import('views/pages/PopularPosts/ModalPosts'));
const ModalPeople = lazyImport(() => import('views/components/ModalPeople'));
const ModalMagazines = lazyImport(() => import('views/components/ModalMagazines'));
const ModalAlbums = lazyImport(() => import('views/components/ModalAlbums'));

// PAGES
const LoginPage = lazyImport(() => import('views/pages/LoginPage/indexV2'));
const SignUpPage = lazyImport(() => import('views/pages/SignUpPage'));
const SearchAppp = lazyImport(() => import('views/pages/MainSearch/StartPage/App'));
const TwitchAuthCallback = lazyImport(() => import('views/pages/Auth/TwitchAuthCallback'));
const GoogleAuthCallback = lazyImport(() => import('views/pages/Auth/GoogleAuthCallback'));
const VkAuthCallback = lazyImport(() => import('views/pages/Auth/VkAuthCallback'));

const MovieProfile = lazyImport(() => import('views/pages/MovieProfile'));
const PersonProfile = lazyImport(() => import('views/pages/PersonProfile'));
const ArtistProfile = lazyImport(() => import('views/pages/ArtistProfile'));
const AlbumProfile = lazyImport(() => import('views/pages/AlbumProfile'));
const PlaylistProfile = lazyImport(() => import('views/pages/PlaylistProfile'));
const TrackProfile = lazyImport(() => import('views/pages/TrackProfile'));
const PostProfile = lazyImport(() => import('views/pages/PostProfile'));
const LinksProfile = lazyImport(() => import('views/pages/LinksProfile'));
const SearchResults = lazyImport(() => import('views/pages/SearchResults'));
const SearchesResults = lazyImport(() => import('views/pages/SearchResults'));

const TrackListLoopV2 = lazyImport(() => import('views/pages/PopularMusic/indexV2'));
const TrackListLoopV1 = lazyImport(() => import('views/pages/PopularMusic/index'));

const VideoFeedProfile = lazyImport(() => import('views/pages/VideoFeedProfile').then(m => ({ default: m.VideoFeedProfile })));
const VideoFeedV2 = lazyImport(() => import('views/pages/VideoFeedProfile/VideoFeedV2').then(m => ({ default: m.VideoFeedV2 })));
const VideoProfile = lazyImport(() => import('views/pages/VideoProfile'));
const PhotosPageUnsplash = lazyImport(() => import('views/pages/PhotosPage/PhotosPageUnsplash').then(m => ({ default: m.PhotosPageUnsplash })));
const PhotosPage = lazyImport(() => import('views/pages/PhotosPage/PhotosPage').then(m => ({ default: m.PhotosPage })));
const ProfilePage = lazyImport(() => import('views/pages/ProfilePage'));
const UserTracksPage = lazyImport(() => import('views/pages/UserTracksPage'));
const PhotoAlbumPage = lazyImport(() => import('views/pages/PhotoAlbum'));
const PhotoAlbumModalPage = lazyImport(() => import('views/pages/PhotoAlbum/PhotoAlbumModal'));
const PhotoAlbumEditPage = lazyImport(() => import('views/pages/PhotoAlbum/PhotoAlbumEdit'));
const UserVideosPage = lazyImport(() => import('views/pages/VideosPage'));
const UsersPage = lazyImport(() => import('views/pages/UsersPage/UsersPage'));
const NoteApp = lazyImport(() => import('views/pages/NoteText/NoteApp'));
const NoteTakingApp = lazyImport(() => import('views/pages/NoteApp/NoteTakingApp'));
const SearchByTag = lazyImport(() => import('views/pages/SavedLinks/SearchByTag'));
const LinkListByTag = lazyImport(() => import('views/pages/SavedLinks/LinkListByTag'));
const LinksList = lazyImport(() => import('views/pages/SavedLinks/LinksList'));
const JustDoListV2 = lazyImport(() => import('views/pages/JustDoList/JustDoListV2'));
const SettingsPage = lazyImport(() => import('views/pages/SettingsPage'));

import PageLoader from 'views/components/PageLoader';

export const ModalRouteContext = React.createContext();

function ModalSwitch({ children, renderModal, stopSong, pauseSong, resumeSong, audioControl }) {
  const { isModal, switchLocation, contextValue, pathname } = useModalSwitchLogic();
  useScrollMemory();

  const auth = getState().users.access_token;
  const isMobile = window.innerWidth <= 768;
  const isChatPath = pathname.startsWith('/chat');
  const isSpecificChat = pathname !== '/chat/im' && isChatPath;

  const showChatList = isChatPath && !(isMobile && isSpecificChat);

  return (
    <ModalRouteContext.Provider value={contextValue}>
      <LayoutWrapper isChat={isChatPath}>
        {showChatList && (
          <Suspense fallback={<PageLoader />}>
            <ChatList
              emojiData={emojiData}
            />
          </Suspense>
        )}
        <Suspense fallback={<PageLoader />}>
          <Switch location={switchLocation}>
            {/* Authentication Routes */}
            <Route path="/login" render={props => auth ? (<Redirect to={{ pathname: '/feed', }} />) : (<LoginPage {...props} />)} />
            <Route path="/signup" render={props => auth ? (<Redirect to={{ pathname: '/feed', }} />) : (<SignUpPage {...props} />)} />
            <Route path="/auth/twitch/callback" component={TwitchAuthCallback} />
            <Route path="/auth/google/callback" component={GoogleAuthCallback} />
            <Route path="/auth/vk/callback" component={VkAuthCallback} />

            {/* Upload Routes */}
            <Route exact path="/cu" component={ChunkUpload} />
            <Route exact path="/ax" component={PostCreator} />
            <Route exact path="/s3upload" component={MediaUploader} />
            <Route exact path="/create" component={PostCreator} />

            {/* Feed/Browse Routes */}
            <Route exact path="/movies" component={ModalMovies} />
            <Route exact path="/feed" component={ModalMovies} />
            <Route exact path="/feedV2" component={ModalPosts} />
            <Route exact path="/people" component={ModalPeople} />
            <Route exact path="/users" component={UsersPage} />
            <Route exact path="/magazines" component={ModalMagazines} />
            <Route exact path="/albums" component={ModalAlbums} />
            <Route exact path="/" component={SearchAppp} />

            {/* Chat Routes */}
            <Route exact path="/chat/im">
              <ChatWindowContainer>
                <h2>Select a chat to start messaging</h2>
              </ChatWindowContainer>
            </Route>
            <Route exact path="/chat/:userId" component={ChatWindow} />
            <Route exact path="/chat/:userId/attachments" component={lazyImport(() => import('views/pages/ChatV3/Main/Attachments'))} />
            <Route exact path="/wow" component={ChatWindowGemini} />

            {/* Music Routes */}
            <Route exact path="/musicv2" component={TrackListLoopV2} />
            <Route exact path="/musicv1" component={TrackListLoopV1} />

            {/* Search Routes */}
            <Route exact path="/search/:searchType" component={SearchResults} />
            <Route exact path="/searches/:query" component={SearchResults} />
            <Route exact path="/searches/:type/:query" component={SearchResults} />

            {/* Profile Routes */}
            <Route path="/movies/:movieId" component={MovieProfile} />
            <Route path="/person/:personId" component={PersonProfile} />
            <Route path="/artist/:artistId">
              <ArtistProfile stopSong={stopSong} pauseSong={pauseSong} resumeSong={resumeSong} audioControl={audioControl} />
            </Route>
            <Route path="/album/:albumId">
              <AlbumProfile stopSong={stopSong} pauseSong={pauseSong} resumeSong={resumeSong} audioControl={audioControl} />
            </Route>
            <Route path="/posts/:postId" component={PostProfile} />
            <Route path="/playlist/:playlistId">
              <PlaylistProfile stopSong={stopSong} pauseSong={pauseSong} resumeSong={resumeSong} audioControl={audioControl} />
            </Route>
            <Route path="/links/:linkId">
              <LinksProfile stopSong={stopSong} pauseSong={pauseSong} resumeSong={resumeSong} audioControl={audioControl} />
            </Route>
            <Route path="/track/:trackId" component={TrackProfile} />
            <Route path="/video/:videoId" component={VideoProfile} />
            <Route path="/vine/:videoId" component={VideoProfile} />

            {/* Feed Routes */}
            <Route path="/videos" component={VideoFeedV2} />
            <Route path="/videofeed" component={VideoFeedProfile} />
            <Route path="/unsplash" component={PhotosPageUnsplash} />
            <Route path="/notes" component={NoteTakingApp} />
            <Route path="/todo" component={JustDoListV2} />
            <Route path="/linktag/search" component={SearchByTag} />
            <Route path="/linktag/all" component={LinksList} />
            <Route path="/linktag/:tagname" component={LinkListByTag} />

            {/* Settings */}
            <Route exact path="/settings" component={SettingsPage} />

            {/* User Albums Route */}
            <Route path="/:username/albums/:photoAlbumId/edit" component={PhotoAlbumEditPage} />
            <Route path="/:username/albums/:photoAlbumId" component={PhotoAlbumModalPage} />
            <Route path="/:username/albums" component={PhotoAlbumPage} />

            {/* User Photos Route */}
            <Route path="/:username/photos" component={PhotosPage} />

            {/* User Tracks Route (must be before catch-all) */}
            <Route path="/:username/tracks" component={UserTracksPage} />

            {/* User Videos Route */}
            <Route path="/:username/videos" component={UserVideosPage} />

            {/* User Profile Route */}
            <Route path="/:username" component={ProfilePage} />
          </Switch>
        </Suspense>
      </LayoutWrapper>

      {isModal && renderModal({
          open: isModal,
          redirectToBack: contextValue.redirectToBack,
          location: contextValue.backgroundLocation
      })}
    </ModalRouteContext.Provider>
  );
}

const LayoutWrapper = styled.div`
  display: ${({ isChat }) => (isChat ? 'flex' : 'block')};
  width: 100%;
  min-height: 100%;
  background-color: var(--navBg, #141414);

  @media screen and (max-width: 768px) {
    flex-direction: ${({ isChat }) => (isChat ? 'column' : 'initial')};
  }
`;

const ChatWindowContainer = styled.div`
  width: 70%;
  background-color: var(--navBg, #141414);;

  padding: 20px;
  box-sizing: border-box;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  height: 90vh;

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

export default ModalSwitch;
