import { addAuthorizationHeader } from "./axios.js";
import API_URL from "./apiurl";

export const replyReview = (id, replyComment, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.post(`${API_URL.REVIEW_URL}/${id}/reply`, { replyComment })
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const deleteReview = (id, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.delete(`${API_URL.REVIEW_URL}/${id}`)
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const updateReview = (id, body, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.put(`${API_URL.REVIEW_URL}/${id}`, body)
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const getPendingReviews = (token) => {
  let axios = addAuthorizationHeader(token);

  return axios.get(`${API_URL.REVIEW_URL}/pending`)
    .then(data => data.data)
    .catch(error => { throw error.response });
}