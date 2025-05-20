import { createAction } from "@reduxjs/toolkit";

export const fetchPopularPosts = createAction(
  "post/fetchPopular",
  (page) => ({
    payload: {
      page
    }
  })
);

export const fetchPost = createAction(
  "post/fetch",
  (postId, requiredFields) => ({
    payload: { postId, requiredFields }
  })
);

export const fetchPost = createAction(
  "post/create",
  (postId, requiredFields) => ({
    payload: { postId, requiredFields }
  })
);

export const fetchPostRecommendations = createAction(
  "post/fetchRecommendations",
  postId => ({
    payload: { postId }
  })
);
