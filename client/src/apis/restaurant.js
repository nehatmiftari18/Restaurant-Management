import { addAuthorizationHeader } from "./axios.js";
import API_URL from "./apiurl";

export const createRestaurant = ( body, token ) => {
  let axios = addAuthorizationHeader(token);
  
  return axios.post(API_URL.CREATE_RESTAURANT_URL, body)
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const getRestaurants = (minRate, maxRate, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.get(`${API_URL.GET_RESTAURANTS_URL}?min=${minRate}&max=${maxRate}`)
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const getRestaurant = (id, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.get(`${API_URL.GET_RESTAURANTS_URL}/${id}`)
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const updateRestaurant = (id, body, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.put(`${API_URL.GET_RESTAURANTS_URL}/${id}`, body)
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const deleteRestaurant = (id, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.delete(`${API_URL.GET_RESTAURANTS_URL}/${id}`)
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const getReviewsForRestaurant = (id, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.get(`${API_URL.GET_RESTAURANTS_URL}/${id}/reviews`)
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const createReview = (id, body, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.post(`${API_URL.GET_RESTAURANTS_URL}/${id}/reviews`, body)
    .then(data => data.data)
    .catch(error => { throw error.response });
}