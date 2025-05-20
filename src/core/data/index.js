const directors = [
  {
    id: '1',
    name: 'Robert Zemeckis',
    movies: [
      { id: '1-1', title: 'Back to the Future 1' },
      { id: '1-2', title: 'Back to the Future 2' },
      { id: '1-3', title: 'Back to the Future 3' },
      { id: '1-4', title: 'Back to the Future 4' },
      { id: '1-5', title: 'Back to the Future 5' },
      { id: '1-6', title: 'Back to the Future 6' },
      { id: '1-7', title: 'Back to the Future 7' },
      { id: '1-8', title: 'Back to the Future 8' },
      { id: '1-9', title: 'Back to the Future 9' },
      { id: '1-10', title: 'Back to the Future 10' }


    ]
  },
  {
    id: '2',
    name: 'David Fincher',
    movies: [
      { id: '2-1', title: 'Social Network' },
      { id: '2-2', title: 'The Girl with the Dragon Tattoo' },
      { id: '2-3', title: 'Fight Club' },
      { id: '2-4', title: 'Se7en' }
    ]
  }
];

export const getMovieById = movieId => {
  const allMovies = getAllMovies();
  return allMovies.find(movie => movie.id === movieId);
};

export const getAllMovies = () => {
  let movies = [];

  directors.forEach(director => {
    movies = [...movies, ...director.movies];
  });

  return movies;
};

export const getDirectorById = directorId => {
  return directors.find(director => director.id === directorId);
};

export const getDirectorByMovieId = movieId => {
  for (let i = 0; i < directors.length; i++) {
    const movie = directors[i].movies.find(movie => movie.id === movieId);
    if (movie) {
      return directors[i];
    }
  }
};

export default directors;
