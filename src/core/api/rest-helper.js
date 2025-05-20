import APIError from './api-error';
import { getState } from 'core/store';
import { UN_AVAILABLE, UNHANDLED } from "core/constants/api-error-codes";
import axios from "axios";

// check status used in fetch promise
function checkStatus(json, res){
  // check response in ok 200 or not
  if (res.ok) {
    // get link header from response
    /**
     * 200 OK
     * Link: <https://api.unsplash.com/users/ashbot/likes>; rel="first", <https://api.unsplash.com/photos/users/ashbot/likes?page=1>; rel="prev", <https://api.unsplash.com/photos/users/ashbot/likes?page=5>; rel="last", <https://api.unsplash.com/photos/users/ashbot/likes?page=3>; rel="next"
     * X-Ratelimit-Limit: 1000
     * X-Ratelimit-Remaining: 999
     */
    const attr = {};
    let linkHeader = res.headers.get('link');
    if (linkHeader) {
      linkHeader = linkHeader.replace(/[<|>|"| ]/g, '').replace(/rel=/g, '');
      const links = linkHeader.split(',');
      links.forEach(item => {
        const part = item.split(';');
        if (part.length === 2) {
          Object.defineProperty(attr, part[1].trim(), {
            value: part[0].trim(),
            writable: false,
            enumerable: false,
          });
        }
      });
    }
    return { response: json, attr };
  }
  // create error with status text, message, code
  const error = new APIError(res.status);
  error.code = res.status;
  error.errors = json.errors;
  error.description = json.error_description;
  return { error };
}

// handle failure error
function failure(err) {
  // handle server unavailable error
  if (err.message && err.message === 'Failed to fetch') {
    const error = new APIError('server unavailable');
    error.errors = 'server unavailable';
    error.code = UN_AVAILABLE;
    return { error };
  } else {
    const error = new APIError('unhandled error happend');
    error.errors = 'unhandled error happend';
    error.code = UNHANDLED;
    return { error };
  }
}


export const getHeaders = (jsonContentType = true) => {
  const headers = new Headers();
  headers.append('Accept-Version', 'v1');
  if (jsonContentType) {
    headers.append('Content-Type', 'application/json');
  }
  headers.append('Accept', 'application/json');
  if (getState().users.access_token) {
    headers.append(
      'Authorization',
      `Bearer ${getState().users.access_token}`
    );
  }
  return headers;
};

export function authHeader() {
  const token = getState().users.access_token
  if (token) {
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
}

export function authHeaderMulti() {
  const token = getState().users.access_token
  if (token) {
    return { Authorization: 'Bearer ' + token };
  }
}


// export const configz = () => {
//   const headers = new Headers();
//   headers.append('Authorization', `Bearer ${getState().users.access_token}`);
//   return headers
// }
export const getReq = (endpoint, headers = getHeaders()) =>
  fetch(endpoint, {
    method: 'GET',
    headers: getHeaders(),
    // headers: authHeader(),
  })
    .then(res => res.json().then(json => ({ json, res })))
    .then(({ json, res }) => checkStatus(json, res))
    .catch(failure);

export const getAxiosReq = (endpoint, headers = getHeaders()) =>
  axios({
    method: 'GET',
    url: endpoint,
    headers: authHeader()
    // headers
  })
    // .then(res => res.json()
    // .then(json => ({ json, res })))
    // .then(({ json, res }) => checkStatus(json, res))
    // .catch(failure);


// export const getData = () => {
//
//   if (data.exist)
//   data.append(
//
//   )
//   return data;
// }
/**
 * get headers for Multi Part requests
 * like upload image
 */
export const getHeadersForMultiPart = () => {
  const headers = new Headers();
  if (getState().user.isAuthorized) {
    headers.append(
      'Authorization',
      `Bearer ${getState().user.token.access_token}`
    );
  }
  return headers;
};


export const postReq = (endpoint, body, headers = getHeaders()) =>
  fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: headers,
  })
    .then(res => res.json().then(json => ({ json, res })))
    .then(({ json, res }) => checkStatus(json, res))
    .catch(failure);


export const postAxiosReq = (endpoint, body, headers = authHeader()) =>
  axios({
    method: 'POST',
    url: endpoint,
    data: body,
    headers: headers,
  })

export const putAxiosReq = (endpoint, body, headers = authHeader()) =>
  axios({
    method: 'PUT',
    url: endpoint,
    data: body,
    headers: headers,
  })
    // .then(res => res.json().then(json => ({ json, res })))
    // .then(({ json, res }) => checkStatus(json, res))
    // .catch(failure);








export const postReqFormData = (endpoint, formData) =>
  fetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: getHeadersForMultiPart(),
  })
    .then(res => res.json().then(json => ({ json, res })))
    .then(({ json, res }) => checkStatus(json, res))
    .catch(failure);


export const deleteReq = (
  endpoint,
  body = {},
  headers = getHeaders()
) =>
  fetch(endpoint, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers,
  })
    .then(res => res.json().then(json => ({ json, res })))
    .then(({ json, res }) => checkStatus(json, res))
    .catch(failure);


export const deleteReqWithoutJSON = (
  endpoint,
  headers = getHeaders()
) =>
  fetch(endpoint, {
    method: 'DELETE',
    headers,
  })
    .then(res => checkStatus({}, res))
    .catch(failure);


export const putReq = (
  endpoint,
  body,
  headers = getHeaders()
) =>
  fetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers,
  })
    .then(res => res.json().then(json => ({ json, res })))
    .then(({ json, res }) => checkStatus(json, res))
    .catch(failure);
