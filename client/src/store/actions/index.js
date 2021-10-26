import {
	UPDATE_USER,
	SET_TOKEN
} from '../actionTypes';


export const setToken = (data) => {
	return {
		type: SET_TOKEN,
		payload: data
	}
}

export const updateUser = (data) => {
	return {
		type: UPDATE_USER,
		payload: data
	};
}