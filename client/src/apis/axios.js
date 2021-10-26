import axios from 'axios';

export const addAuthorizationHeader = (token) => {

	axios.defaults.headers.get['Authorization'] = `Bearer ${token}`;
	axios.defaults.headers.post['Authorization'] = `Bearer ${token}`;
	axios.defaults.headers.put['Authorization'] = `Bearer ${token}`;
	axios.defaults.headers.delete['Authorization'] = `Bearer ${token}`;

	return axios;
}

export default axios;