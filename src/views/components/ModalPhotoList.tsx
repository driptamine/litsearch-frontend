import React from 'react';
import ModalLink  from './ModalLink';
import PropTypes from 'prop-types';
// import { getAllPhotos } from '../data';

const ModalPhotoList = ({ photos }) => {
  // const photos = getAllPhotos();

  return (
    <ul>
      {photos.map(photo => (
        <li key={photo.id}>
          <ModalLink to={`/photos/${photo.id}`}>
            {photo.title}
          </ModalLink>
        </li>
      ))}
    </ul>
  );
};

// MovieList.propTypes = {
//   movies: PropTypes.arrayOf(PropTypes.object)
// };

export default ModalPhotoList;
