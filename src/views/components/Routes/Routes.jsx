// V6
import React from "react";
import { Route, Redirect } from "react-router-dom";
import PopularMovies from "views/pages/PopularMovies";
import MovieProfile from "views/pages/MovieProfile";
import PersonProfile from "views/pages/PersonProfile";
import ArtistProfile from "views/pages/ArtistProfile";
import PopularPeople from "views/pages/PopularPeople";
import SearchResults from "views/pages/SearchResults";
import SwitchWithScrollRestoration from "views/components/SwitchWithScrollRestoration";

function Routes() {
  return (
    <SwitchWithScrollRestoration>
      <Route exact path="/search/:searchType">
        <SearchResults />
      </Route>
      <Route exact path="/movies">
        <PopularMovies />
      </Route>
      <Route path="/movies/:movieId">
        <MovieProfile />
      </Route>
      <Route exact path="/person/popular">
        <PopularPeople />
      </Route>
      <Route path="/person/:personId">
        <PersonProfile />
      </Route>
      <Route path="/artist/:artistId">
        <ArtistProfile />
      </Route>

      {/*<Route path="*">
        <Redirect to="/movies" />
      </Route>*/}
    </SwitchWithScrollRestoration>
  );
}

export default Routes;
