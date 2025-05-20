import { createAction } from "@reduxjs/toolkit";

export const fetchPersonSearch = createAction(
  "person/search",
  (query, page) => ({
    payload: { query, page }
  })
);

export const fetchPerson = createAction(
  "person/fetch",
  (personId, requiredFields) => ({
    payload: {
      personId,
      requiredFields
    }
  })
);

export const fetchPersonCredits = createAction(
  "person/fetchCredits",
  personId => ({
    payload: { personId }
  })
);

export const fetchPopularPeople = createAction(
  "person/fetchPopular",
  page => ({
    payload: { page }
  })
);

export const fetchPersonImages = createAction(
  "person/fetchImages",
  personId => ({
    payload: { personId }
  })
);
