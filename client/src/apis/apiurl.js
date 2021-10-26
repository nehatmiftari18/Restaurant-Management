export const API_BASE_URL = `http://localhost:8000/api/v1`;

export default {
  
    LOGIN_USER_URL: `${API_BASE_URL}/users/login`,
    REGISTER_USER_URL: `${API_BASE_URL}/users/register`,
    UPDATE_PROFILE_URL: `${API_BASE_URL}/users/profile`,
    CHANGE_PASSWORD_URL: `${API_BASE_URL}/users/password`,
    USER_URL: `${API_BASE_URL}/users`,

    CREATE_RESTAURANT_URL: `${API_BASE_URL}/restaurants`,
    GET_RESTAURANTS_URL: `${API_BASE_URL}/restaurants`,

    REVIEW_URL: `${API_BASE_URL}/reviews`

  }