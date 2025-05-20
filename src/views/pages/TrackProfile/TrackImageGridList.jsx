import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbumImages } from "core/actions";
import { selectors } from "core/reducers/index";
import ImageGridList from "views/components/ImageGridList";
import ImageGalleryModal from "views/components/ImageGalleryModal";
import { getAspectRatioString } from "views/components/AspectRatio";

function AlbumImageGridList({ albumId }) {
//   const dispatch = useDispatch();
//   const album = useSelector(state => selectors.selectAlbum(state, albumId));
//   const filePaths = useSelector(state =>
//     selectors.selectAlbumImages(state, albumId)
//   );
//   const isFetching = useSelector(state =>
//     selectors.selectIsFetchingAlbumImages(state, albumId)
//   );
//
//   useEffect(() => {
//     dispatch(fetchAlbumImages(albumId));
//   }, [dispatch, albumId]);
//
//   return (
//     <>
//       <ImageGridList
//         filePaths={filePaths}
//         isFetching={isFetching}
//         aspectRatio={getAspectRatioString(16, 9)}
//       />
//       <ImageGalleryModal title={album?.title} filePaths={filePaths} />
//     </>
//   );
}
//
// export default AlbumImageGridList;
