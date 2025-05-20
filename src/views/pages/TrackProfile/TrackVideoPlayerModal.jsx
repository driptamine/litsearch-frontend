import React from "react";
import { useSelector } from "react-redux";
import { selectors } from "core/reducers/index";
import useQueryString from "core/hooks/useQueryString";
import MediaGalleryModal from "views/components/MediaGalleryModal";

function TrackVideoPlayerModal({ albumId }) {
  const albumVideoIds =
    useSelector(state => selectors.selectAlbumVideos(state, albumId)) || [];
  const albumVideos = useSelector(state =>
    albumVideoIds.map(albumVideoId =>
      selectors.selectVideo(state, albumVideoId)
    )
  );
  const videoKeys = albumVideos.map(video => video.key);

  const { watch } = useQueryString();
  const videoToWatch = albumVideos.find(video => video.key === watch);

  return (
    <MediaGalleryModal
      title={videoToWatch?.name}
      dataSource={videoKeys}
      queryParamName="watch"
      isVideoPlayer={true}
    />
  );
}

export default TrackVideoPlayerModal;
