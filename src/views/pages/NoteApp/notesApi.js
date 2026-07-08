import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const api = axios.create({
  baseURL: `${LITLOOP_API_URL}/notes`,
});

api.interceptors.request.use((config) => {
  const headers = authHeader();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

export const fetchPages = () => api.get('/pages/').then(r => r.data);

export const createPage = (title = 'Untitled', parentId = null) =>
  api.post('/pages/create/', { title, parent_id: parentId }).then(r => r.data);

export const fetchPage = (pageId) => api.get(`/pages/${pageId}/`).then(r => r.data);

export const updatePage = (pageId, data) =>
  api.put(`/pages/${pageId}/update/`, data).then(r => r.data);

export const deletePage = (pageId) =>
  api.delete(`/pages/${pageId}/delete/`).then(r => r.data);

export const createBlock = (pageId, content = '', order = null, type = 'text', tableData = null) => {
  const body = { content, type };
  if (order !== null) body.order = order;
  if (tableData !== null) body.table_data = tableData;
  return api.post(`/pages/${pageId}/blocks/create/`, body).then(r => r.data);
};

export const updateBlockTable = (blockId, columns, rows) =>
  api.put(`/blocks/${blockId}/table/`, { columns, rows }).then(r => r.data);

export const updateBlock = (blockId, data) =>
  api.put(`/blocks/${blockId}/update/`, data).then(r => r.data);

export const deleteBlock = (blockId) =>
  api.delete(`/blocks/${blockId}/delete/`).then(r => r.data);

export const fetchTags = (pageId) =>
  api.get(`/pages/${pageId}/tags/`).then(r => r.data);

export const addTag = (pageId, name) =>
  api.post(`/pages/${pageId}/tags/add/`, { name }).then(r => r.data);

export const deleteTag = (tagId) =>
  api.delete(`/tags/${tagId}/delete/`).then(r => r.data);

export const searchPagesByTags = (tagNames) =>
  api.post('/search-by-tags/', { tags: tagNames }).then(r => r.data);
