import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";


// MATERIAL DONE
// import { useTheme } from "@mui/material/styles";
import AlbumCard from "views/components/AlbumCard";
import BaseGridList from "views/components/BaseGridList";

// CORE
import { fetchArtistAlbums } from "core/actions";
import { selectors } from "core/reducers/index";

const StyledBaseGridList = styled(BaseGridList)`
  min-item-width: ${props => 260 / 2 - props.theme.spacing}
`;

function renderItem(albumId) {
  return (
    <li>
      <AlbumCard albumId={albumId} />
    </li>
  );
}

function ArtistAlbums({ artistId }) {
  const artistAlbumsIds = useSelector(
    state => selectors.selectArtistAlbums(state, artistId) || []
  );
  const isFetching = useSelector(state =>
    selectors.selectIsFetchingArtistAlbums(state, artistId)
  );
  // const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArtistAlbums(artistId));
  }, [artistId, dispatch]);

  return (
    <StyledBaseGridList
      items={artistAlbumsIds}
      loading={isFetching}
      renderItem={renderItem}
      // minItemWidth={260 / 2 - theme.spacing(2)}
      listEmptyMessage="No recommendation has been found"
    />
  );
}

export default ArtistAlbums;
