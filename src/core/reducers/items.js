import omit from 'lodash/omit';
// import camelCaseKeys from 'camelcase-keys-deep';
// import type { Action } from '../types';
// import type { ItemsState } from '../types/state';

const initialState = {
  albums: {},
  photos: {},
  photosAttr: {},
  userCollections: {},
  userCollectionsAttr: {},
  collections: {},
  collectionsAttr: {},
};


export default (state = initialState, action) => {
  const response = action.payload;
  switch (action.type) {
    // action > setItem
    case 'items/SE_ITEM': {
      // NOTE: in SE_ITEM added to first
      // const element = camelCaseKeys(action.payload);
      const element = action.payload;

      const newObj = Object.assign(
        {},
        {
          [action.payload.id]: { ...element },
        }
      );
      return Object.assign({}, state, {
        [action.entity]: {
          ...newObj,
          ...state[action.entity],
        },
      });
    }
    // action > setItems
    case 'items/SE_ITEMS': {
      // the payload === array of entity items
      let newItems = {};
      for (let i = 0; i < action.payload.length; i++) {
        let element = action.payload[i];
        // element = camelCaseKeys(element);
        newItems = Object.assign({}, newItems, {
          [element.id]: { ...element },
        });
      }
      // like > state.items.photos
      return Object.assign({}, state, {
        [action.entity]: {
          ...state[action.entity],
          ...newItems,
        },
      });
    }
    // action > updateItem(entity,payload)
    case 'items/UP_ITEM': {
      // the payload === item object
      return Object.assign({}, state, {
        [action.entity]: {
          ...state[action.entity],
          [action.payload.id]: action.payload,
        },
      });
    }
    // action > updateFieldOfItem
    // case 'items/UP_FIELD_OF_ITEM':
    //   // first get items
    //   const items = state.albums;
    //   // get item by id
    //   const item = items[action.payload.id];
    //   // if dosn't have any item with this id
    //   if (!item) {
    //     return state;
    //   }
    //   // const fields = camelCaseKeys(action.fields);
    //   const fields = action.payload.fields;
    //   const obj = Object.assign({}, item, {
    //     ...fields,
    //   });
    //   return Object.assign({}, state, {
    //     albums: {
    //       ...state.albums,
    //       [action.payload.id]: obj,
    //     },
    //   });

    // case 'items/UP_FIELD_OF_ITEM': {
    //   // first get items
    //   const items = state[action.payload.entity];
    //   // get item by id
    //   const item = items[action.payload.id];
    //   // if dosn't have any item with this id
    //   if (!item) {
    //     return state;
    //   }
    //   // const fields = camelCaseKeys(action.fields);
    //   const fields = action.payload.fields;
    //   const obj = Object.assign({}, item, {
    //     ...fields,
    //   });
    //   return Object.assign({}, state, {
    //     [action.payload.entity]: {
    //       ...state[action.payload.entity],
    //       [action.payload.id]: obj,
    //     },
    //   });
    // }
    // case 'items/UP_FIELD_OF_ITEM':
    //   // return { ...state, response };
    //   return Object.assign({}, state,
    //       {
    //           albums: {
    //             ...state.albums, [action.payload.id]: action.payload.fields
    //           }
    //       }
    //   );
    // case 'items/UP_FIELD_OF_ITEM':
    //
    //   let index = state.photos.findIndex(
    //     (photo) => photo.photoId === action.payload.photoId
    //   );
    //   state.photos[index] = action.payload;
    //   if (state.photo.photoId === action.payload.photoId) {
    //     state.photo = action.payload;
    //   }
    //   return {
    //     ...state
    //   };
    // action > deleteItem(entity,payload)
    case 'items/RM_ITEM': {
      // action.payload === id of item to delete
      return Object.assign({}, state, {
        [action.entity]: omit(state[action.entity], action.id),
      });
    }
    // action > clearItems()
    case 'items/CL_ITEMS': {
      // clear both items entity and entityAttr
      return Object.assign({}, state, {
        [action.entity]: {},
        [`${action.entity}Attr`]: {},
      });
    }
    // action > setItemsAttr(entity,attrObj)
    case 'items/SE_ITEMS_ATTR': {
      // like > state.items.photosAttr.total
      return Object.assign({}, state, {
        [`${action.entity}Attr`]: action.attrObj,
      });
    }

    // COLLECTIONS
    case 'phot/SE_ITEM': {
      // NOTE: in SE_ITEM added to first
      // const element = camelCaseKeys(action.payload.results);
      const element = action.payload.results;
      const newObj = Object.assign(
        {},
        {
          [action.payload.results.id]: { ...element },
        }
      );
      return Object.assign({}, state, {
        [action.entity]: {
          ...newObj,
          ...state[action.entity],
        },
      });
    }
    // action > setItems
    case 'phot/SE_ITEMS': {
      // the payload === array of entity items
      let newItems = {};
      for (let i = 0; i < action.payload.results.length; i++) {
        let element = action.payload.results[i];
        // element = camelCaseKeys(element);
        element = element;
        newItems = Object.assign({}, newItems, {
          [element.id]: { ...element },
        });
      }
      // like > state.items.photos
      return Object.assign({}, state, {
        [action.entity]: {
          ...state[action.entity],
          ...newItems,
        },
      });
    }
    //
    case 'phot/CL_ITEMS': {
      // clear both items entity and entityAttr
      return Object.assign({}, state, {
        [action.entity]: {},
        [`${action.entity}Attr`]: {},
      });
    }
    //
    case 'phot/SE_ITEMS_ATTR': {
      // like > state.items.photosAttr.total
      return Object.assign({}, state, {
        [`${action.entity}Attr`]: action.attrObj,
      });
    }
    default:
      return state;
  }
};

export const selectors = {
  // selectMovie,
  // token: createIsFetching(actions.fetchAuthUser),
  // selectMovies: (state, movieIds) =>
  //   movieIds.map(movieId => selectMovie(state, movieId)),

};
