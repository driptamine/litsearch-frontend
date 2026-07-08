import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const api = axios.create({
  baseURL: `${LITLOOP_API_URL}/posts`,
});

api.interceptors.request.use((config) => {
  const headers = authHeader();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

export const fetchPostComments = (postId) =>
  api.get(`/${postId}/comments/`).then(r => r.data.comments);

export const createPostComment = (postId, text, parentCommentId = null) =>
  api.post(`/${postId}/comments/create/`, { text, parent_comment_id: parentCommentId }).then(r => r.data);
