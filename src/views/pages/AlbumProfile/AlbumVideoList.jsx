import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbumVideos } from "core/actions";
import { selectors } from "core/reducers/index";
import BaseList from "views/components/BaseList";
import LoadingIndicator from "views/components/LoadingIndicator";
import AlbumVideoListItem from "./AlbumVideoListItem";
import AlbumVideoPlayerModal from "./AlbumVideoPlayerModal";

function AlbumVideoList({ albumId }) {
  const dispatch = useDispatch();
  const albumVideoIds =
    useSelector(state => selectors.selectAlbumVideos(state, albumId)) || [];
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingAlbumVideos(state, albumId)
  );

  useEffect(() => {
    dispatch(fetchAlbumVideos(albumId));
  }, [dispatch, albumId]);

  return (
    <LoadingIndicator loading={isFetching}>
      <BaseList
        data={albumVideoIds}
        renderItem={videoId => (
          <AlbumVideoListItem key={videoId} videoId={videoId} />
        )}
        listEmptyMesage="No video has been found"
      />
      <AlbumVideoPlayerModal albumId={albumId} />
    </LoadingIndicator>
  );
}

export default AlbumVideoList;
