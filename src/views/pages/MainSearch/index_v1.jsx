import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectors } from "core/reducers/index";
import AutoSearch from "views/components/AutoSearch";
import { fetchSearch } from "core/actions";
import PersonListItem from "./PersonListItem";
import MovieListItem from "./MovieListItem";
import TrackListItem from "./TrackListItem";
import ArtistListItem from "./ArtistListItem";
import AlbumListItem from "./AlbumListItem";
import useHistoryPush from "core/hooks/useHistoryPush";

function MovieAndPersonAutoSearch({ className, autoFocus }) {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const historyPush = useHistoryPush();

  const movieIds =
    useSelector(state =>
      selectors.selectMovieSearchResultIds(state, searchValue)
    ) || [];
  const movies = useSelector(state => selectors.selectMovies(state, movieIds));

  const trackIds =
    useSelector(state =>
      selectors.selectTrackSearchResultIds(state, searchValue)
    ) || [];
  const tracks = useSelector(state => selectors.selectTracks(state, trackIds));

  const albumIds =
    useSelector(state =>
      selectors.selectAlbumSearchResultIds(state, searchValue)
    ) || [];
  const albums = useSelector(state => selectors.selectAlbums(state, albumIds));


  const artistIds =
    useSelector(state =>
      selectors.selectArtistSearchResultIds(state, searchValue)
    ) || [];
  const artists = useSelector(state => selectors.selectArtists(state, artistIds));

  const personIds =
    useSelector(state =>
      selectors.selectPersonSearchResultIds(state, searchValue)
    ) || [];
  const people = useSelector(state => selectors.selectPeople(state, personIds));

  const isFetching = useSelector(state =>
    selectors.selectIsFetchingSearch(state)
  );

  useEffect(() => {
    dispatch(fetchSearch(searchValue));
  }, [dispatch, searchValue]);

  function handleInputValueChange(inputValue) {
    setSearchValue(inputValue);
  }

  function handleRedirect(inputValue) {
    if (inputValue) {
      historyPush(`/search/movie?query=${inputValue}`);
    } else {
      historyPush("/movie/popular");
    }
  }

  function handleSelectSuggestion(selectedSuggestion) {
    if (selectedSuggestion) {
      switch (selectedSuggestion.suggestionType) {
        case "movie":
          historyPush(`/movies/${selectedSuggestion.id}`);
          break;
        case "person":
          historyPush(`/person/${selectedSuggestion.id}`);
          break;
        case "artist":
          historyPush(`/artist/${selectedSuggestion.id}`);
          break;
        case "album":
          historyPush(`/album/${selectedSuggestion.id}`);
          break;
        case "track":
          historyPush(`/track/${selectedSuggestion.id}`);
          break;
        default:
          return;
      }
    }
  }

  let suggestions = [
    ...movies.slice(0, 3).map(movie => ({ ...movie, suggestionType: "movie" })),
    ...people.slice(0, 3).map(person => ({ ...person, suggestionType: "person" })),
    ...albums.slice(0, 3).map(album => ({ ...album, suggestionType: "album" })),
    ...tracks.slice(0, 3).map(track => ({ ...track, suggestionType: "track" })),
    ...artists.slice(0, 3).map(artist => ({ ...artist, suggestionType: "artist" })),
  ];

  // suggestions = suggestions.sort((a, b) =>
  //   a[a.suggestionType === "movie" ? "title" : "name"].localeCompare(
  //     b[b.suggestionType === "movie" ? "title" : "name"]
  //   )
  // );

  // renderSuggestion={suggestion =>
  //   (suggestion.suggestionType === "track") ?
  //   (<TrackListItem movieId={suggestion.id}/>):
  //   (suggestion.suggestionType === "movie") ?
  //   (<MovieListItem movieId={suggestion.id}/>):
  //   (<PersonListItem personId={suggestion.id}/>)
  //
  // }

  // renderSuggestion={suggestion =>
  //   suggestion.suggestionType === "movie" ? (
  //     <MovieListItem movieId={suggestion.id} />
  //   ) : (
  //     <PersonListItem personId={suggestion.id} />
  //   )
  // }
  return (
    <AutoSearch
      className={className}
      extractSuggestionKey={suggestion =>
        `${suggestion.suggestionType}_${suggestion.id}`
      }
      placeholder="Search and Discover"
      suggestions={suggestions}
      renderSuggestion={suggestion =>

        (suggestion.suggestionType === "artist") ?
        (<ArtistListItem artistId={suggestion.id}/>):

        (suggestion.suggestionType === "track") ?
        (<TrackListItem trackId={suggestion.id}/>):

        (suggestion.suggestionType === "movie") ?
        (<MovieListItem movieId={suggestion.id}/>):
        // (suggestion.suggestionType === "person") ?
        // (<PersonListItem personId={suggestion.id}/>):
        (suggestion.suggestionType === "album") ?
        (<AlbumListItem albumId={suggestion.id}/>):
        // (suggestion.suggestionType === "person") ?
        (<PersonListItem personId={suggestion.id}/>)
        // (<TrackListItem trackId={suggestion.id}/>)

        // (<MovieListItem movieId={suggestion.id}/>)
      }
      loading={isFetching}
      inputValue={searchValue || ''}
      onInputValueChange={handleInputValueChange}
      onPressEnterOrClickSearch={handleRedirect}
      onItemSelect={handleSelectSuggestion}
      autoFocus={autoFocus}
    />
  );
}

export default MovieAndPersonAutoSearch;
