import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchArtistImages } from "core/actions";
import { selectors } from "core/reducers/index";
import ImageGridList from "views/components/ImageGridList";
import ImageGalleryModal from "views/components/ImageGalleryModal";
import { getAspectRatioString } from "views/components/AspectRatio";

// function ArtistImageGridList({ artistId }) {
//   const dispatch = useDispatch();
//   const artist = useSelector(state => selectors.selectArtist(state, artistId));
//   const filePaths = useSelector(state =>
//     selectors.selectArtistImages(state, artistId)
//   );
//   const isFetching = useSelector(state =>
//     selectors.selectIsFetchingArtistImages(state, artistId)
//   );
//
//   useEffect(() => {
//     dispatch(fetchArtistImages(artistId));
//   }, [dispatch, artistId]);
//
//   return (
//     <>
//       <ImageGridList
//         filePaths={filePaths}
//         isFetching={isFetching}
//         aspectRatio={getAspectRatioString(2, 3)}
//         minItemWidth={80}
//       />
//       <ImageGalleryModal title={artist?.name} filePaths={filePaths} />
//     </>
//   );
// }
//
// export default ArtistImageGridList;
