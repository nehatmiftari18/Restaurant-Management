import store from 'store';
import {
	UPDATE_USER,
	SET_TOKEN
} from '../actionTypes';

const INIT_STATE = {
	user: store.get('user'),
	token: store.get('token')
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {

		case SET_TOKEN:
			store.set('token', action.payload);

			return {
				...state,
				token: action.payload
			}

		case UPDATE_USER:

			store.set('user', action.payload);
			
			return {
				...state,
				user: action.payload,
			};

		default:
			return state;
	}
}