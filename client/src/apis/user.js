import { addAuthorizationHeader } from "./axios.js";
import API_URL from "./apiurl";

export const loginUser = ( body ) => {
  let axios = addAuthorizationHeader(null);

  return axios.post(API_URL.LOGIN_USER_URL, body)
  .then(data => data.data)
  .catch(error => { throw error.response });
}

export const registerUser = ( body ) => {
  let axios = addAuthorizationHeader(null);

  return axios.post(API_URL.REGISTER_USER_URL, body)
    .then(data => data.data)
    .catch(error => { throw error.response });
}

export const getAllUsers = (role, token) => {
  let axios = addAuthorizationHeader(token);

  if (role) {
    return axios.get(`${API_URL.USER_URL}?role=${role}`)
    .then(data => data.data)
    .catch(error => { throw error.response });

  } else {
    return axios.get(`${API_URL.USER_URL}`)
      .then(data => data.data)
      .catch(error => { throw error.response });
  }
}

export const createUser = (body, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.post(`${API_URL.USER_URL}`, body)
      .then(data => data.data)
      .catch(error => { throw error.response });
}

export const updateUser = (id, body, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.put(`${API_URL.USER_URL}/${id}`, body)
      .then(data => data.data)
      .catch(error => { throw error.response });
}

export const getUserById = (id, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.get(`${API_URL.USER_URL}/${id}`)
      .then(data => data.data)
      .catch(error => { throw error.response });
}

export const deleteUser = (id, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.delete(`${API_URL.USER_URL}/${id}`)
      .then(data => data.data)
      .catch(error => { throw error.response });
}

export const updateProfile = (body, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.put(`${API_URL.UPDATE_PROFILE_URL}`, body)
      .then(data => data.data)
      .catch(error => { throw error.response });
}

export const changePassword = (body, token) => {
  let axios = addAuthorizationHeader(token);

  return axios.put(`${API_URL.CHANGE_PASSWORD_URL}`, body)
      .then(data => data.data)
      .catch(error => { throw error.response });
}