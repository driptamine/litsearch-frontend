import { schema } from 'normalizr';

export const genreSchema = new schema.Entity("genres");

// export const webSchema = new schema.Entity(
//   "websites",
//   {
//     // genres: [genreSchema]
//   },
//   {
//     processStrategy: entity => {
//
//       const result = { ...entity };
//       const {  ...rest } = result;
//
//       return rest;
//     },
//
//     idAttribute: (entity, parent) => `${entity}`
//   }
// );
export const webSchema = new schema.Entity(
  "websites",
  {

  },
  {
    idAttribute: (entity, parent) => `${entity.url}`
  }
);
export const imagesSchema = new schema.Entity(
  "images",
  {

  },
  {
    idAttribute: (entity, parent) => `${entity.properties.url}`
  }
);
export const imagesSchemaBing = new schema.Entity(
  "images",
  {

  },
  {
    idAttribute: (entity, parent) => `${entity.imageId}`
  }
);
export const querySchema = new schema.Entity(
  "queries",
  {

  },
  {
    idAttribute: (entity, parent) => `${entity.query}`
  }
);

export const movieSchema = new schema.Entity(
  "movies",
  {
    genres: [genreSchema]
  },
  {
    processStrategy: entity => {
      // In movie list, API returns genre_ids.
      // In movie details, it returns id and name of genres.
      // Thus, we will merge them as "genres" to not have the same keys on
      // 2 different fields.
      const result = {
        genres: entity.genres || entity.genre_ids,
        ...entity
      };

      // Simply omitting "genre_ids" from the result and
      // returning the "rest".
      const { genre_ids, ...rest } = result;

      return rest;
    }
  }
);

export const albumzSchema = new schema.Entity(
  "albums",
  {
    genres: [genreSchema]
  },
  {
    processStrategy: entity => {
      // In movie list, API returns genre_ids.
      // In movie details, it returns id and name of genres.
      // Thus, we will merge them as "genres" to not have the same keys on
      // 2 different fields.
      const result = {
        genres: entity.genres || entity.genre_ids,
        ...entity
      };

      // Simply omitting "genre_ids" from the result and
      // returning the "rest".
      const { genre_ids, ...rest } = result;

      return rest;
    }
  }
);

export const albumSchema = new schema.Entity(
  "albums",
  {
    genres: [genreSchema]
  },
  {
    idAttribute: (entity, parent) => `${entity.id}`

  }
);

export const playlistSchema = new schema.Entity(
  "playlists",
  {
    genres: [genreSchema]
  },
  {
    idAttribute: (entity, parent) => `${entity.id}`

  }
);

export const albumSchemaUpd = new schema.Entity(
  "albums",
  {
    genres: [genreSchema]
  },
  {
    idAttribute: (entity, parent) => `${entity.album_uri}`

  }
);

export const albummSchema = new schema.Entity(
  "albums",
  {
    genres: [genreSchema]
  },
  {
    idAttribute: (entity, parent) => `${entity.id}`

  }
);

export const authSchema = new schema.Entity(
  "users",
  {

  },
  {
    processStrategy: value => {
      if (value) {
        return {
          ...value,
          // Omitting tv series info of people.
          // We are only selecting "movie" type media.
          token: value.access_token
        };
      }

      return value;
    }
  }
);

export const personSchema = new schema.Entity(
  "people",
  {
    known_for: [movieSchema]
  },
  {
    processStrategy: value => {
      if (value.known_for) {
        return {
          ...value,
          // Omitting tv series info of people.
          // We are only selecting "movie" type media.
          known_for: value.known_for.filter(
            media => media.media_type === "movie"
          )
        };
      }

      return value;
    }
  }
);

export const artistSchema = new schema.Entity(
  "artists",
  {

  },
  {
    idAttribute: (entity, parent) => `${entity.id}`,

  }
);

export const artistSchemaUpd = new schema.Entity(
  "artists",
  {

  },
  {
    idAttribute: (entity, parent) => `${entity.artist_uri}`,

  }
);

export const artistSearchSchema = new schema.Entity(
  "artists",
  {

  },
  {
    // idAttribute: (entity, parent) => `${entity.artist_uri}`,
    processStrategy: value => {
      if (value.images) {
        return {
          ...value,
          // Omitting tv series info of people.
          // We are only selecting "movie" type media.
          images: value.images.filter(
            media => media.url
          )
        };
      }

      return value;
    }
  }
);

export const albumziSchema = new schema.Entity(
  "albums",
  {

  },
  {
    processStrategy: value => {
      if (value.images) {
        return {
          ...value,
          // Omitting tv series info of people.
          // We are only selecting "movie" type media.
          images: value.images.filter(
            media => media.url
          )
        };
      }

      return value;
    }
  }
);

export const trackkSchema = new schema.Entity(
  "tracks",
  {
    genres: [genreSchema]
  },
  {
    processStrategy: entity => {
      // In movie list, API returns genre_ids.
      // In movie details, it returns id and name of genres.
      // Thus, we will merge them as "genres" to not have the same keys on
      // 2 different fields.
      const result = {
        genres: entity.genres || entity.genre_ids,
        ...entity
      };

      // Simply omitting "genre_ids" from the result and
      // returning the "rest".
      const { genre_ids, ...rest } = result;

      return rest;
    }
  }
);

export const trackzSchema = new schema.Entity(
  "tracks",
  {
    // known_for: [movieSchema]
  },
  {
    processStrategy: value => {
      if (value.known_for) {
        return {
          ...value,
          // Omitting tv series info of people.
          // We are only selecting "movie" type media.
          known_for: value.images.filter(
            media => media.url
          )
        };
      }

      return value;
    }
  }
);

export const trackSchema = new schema.Entity(
  "tracks",
  {
    // known_for: [movieSchema]
  },
  {
    idAttribute: (entity, parent) => `${entity.id}`,

  }
);

export const trackpSchema = new schema.Entity(
  "tracks",
  {
    // known_for: [movieSchema]
  },
  {
    idAttribute: (entity, parent) => `${entity.track.id}`,

  }
);

export const trackSchemaUpd = new schema.Entity(
  "tracks",
  {
    // known_for: [movieSchema]
  },
  {
    idAttribute: (entity, parent) => `${entity.track_uri}`,

  }
);

export const artistAlbumSchema = new schema.Entity(
  "artistAlbums",
  {
    albums: [albumSchema]
  },
  {
    idAttribute: entity => entity.id,
    processStrategy: entity => {
      // Omitting unnecessary fields

      // const { artist_uri, results, ...rest } = value;
      // return { artist_uri, albums: results, rest };

      const { artist_uri, results, ...rest } = entity;
      return rest;
    }
  }
);

export const playlistTracksSchema = new schema.Entity(
  "playlistTracks",
  {
    tracks: [trackSchema]
    // tracks: [trackkSchema]
  },
  {
    idAttribute: entity => entity.track.id,
    // idAttribute: value => value.id,
    // processStrategy: value => {
    //   // Omitting unnecessary fields
    //   const { id, results } = value;
    //   return {
    //     id,
    //     tracks: results };
    // },
    // processStrategy: value => {
    //   // We are omitting "posters".
    //   const { id, backdrops } = value;
    //   return {
    //     movieId: id,
    //     backdrops: backdrops
    //   };
    // }
  }
);

export const castCreditSchema = new schema.Entity(
  "castCredits",
  {
    person: personSchema,
    movie: movieSchema
  },
  {
    idAttribute: value => value.credit_id,
    processStrategy: (value, parent, key) => {
      switch (key) {
        case "castings":
          const {
            adult,
            backdrop_path,
            genre_ids,
            id,
            original_language,
            original_title,
            overview,
            popularity,
            poster_path,
            release_date,
            title,
            video,
            vote_average,
            vote_count,
            ...rest
          } = value;

          const movie = {
            adult,
            backdrop_path,
            genres: genre_ids,
            id,
            original_language,
            original_title,
            overview,
            popularity,
            poster_path,
            release_date,
            title,
            video,
            vote_average,
            vote_count
          };

          return {
            ...rest,
            movie,
            person: parent.id
          };
        case "cast": {
          return value;
        }
        default:
          return value;
      }
    }
  }
);

export const personCreditSchema = new schema.Entity(
  "personCredits",
  {
    castings: [castCreditSchema]
  },
  {
    processStrategy: value => {
      // Omittig crew values
      const { id, cast } = value;

      return {
        personId: id,
        castings: cast
      };
    }
  }
);

export const movieCreditSchema = new schema.Entity(
  "movieCredits",
  {
    cast: [castCreditSchema]
  },
  {
    processStrategy: (value, parent, key) => {
      // Omittig crew values and formatting cast fields
      const { id: movieId, cast } = value;

      const formattedCast = cast.map(
        ({ id, name, gender, profile_path, ...rest }) => ({
          ...rest,
          person: {
            id,
            name,
            gender,
            profile_path
          }
        })
      );

      return {
        movieId,
        cast: formattedCast
      };
    }
  }
);

export const videoSchema = new schema.Entity("videos");

export const movieVideoSchema = new schema.Entity(
  "movieVideos",
  {
    videos: [videoSchema]
  },
  {
    idAttribute: value => value.id,
    processStrategy: value => {
      const { id, results } = value;
      return {
        movieId: id,
        // We are only using YouTube videos.
        videos: results.filter(video => video.site === "YouTube")
      };
    }
  }
);


export const movieRecommendationSchema = new schema.Entity(
  "movieRecommendations",
  {
    movies: [movieSchema]
  },
  {
    idAttribute: value => value.movieId,
    processStrategy: value => {
      // Omitting unnecessary fields
      const { movieId, results } = value;
      return {
        movieId,
        movies: results
      };
    }
  }
);

export const playlistTrackzSchema = new schema.Entity(
  "playlistTracks",
  {
    tracks: [trackSchema]
  },
  {
    // idAttribute: value => value.id,
    idAttribute: entity => entity.trackId,
    processStrategy: value => {
      // Omitting unnecessary fields
      const { trackId, results } = value;
      return {
        trackId,
        tracks: results
        // tracks: results.map(item => item)
      };
    },
    // processStrategy: value => {
    //   // We are omitting "posters".
    //   const { id, backdrops } = value;
    //   return {
    //     movieId: id,
    //     backdrops: backdrops
    //   };
    // }
  }
);


const imageSchema = new schema.Entity(
  "images",
  {},
  { idAttribute: value => value.file_path }
);

export const movieImageSchema = new schema.Entity(
  "movieImages",
  {
    backdrops: [imageSchema]
  },
  {
    processStrategy: value => {
      // We are omitting "posters".
      const { id, backdrops } = value;
      return {
        movieId: id,
        backdrops
      };
    }
  }
);

export const personImageSchema = new schema.Entity(
  "personImages",
  {
    profiles: [imageSchema]
  },
  {
    processStrategy: value => {
      const { id, profiles } = value;
      return {
        personId: id,
        profiles
      };
    }
  }
);
