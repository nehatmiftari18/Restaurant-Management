import store from "store";
import axios from "./axios.js";

axios.interceptors.response.use( (response) => {
	return response;
}, (error) => {
	if (error.response) {

		if (error.response.status === 401) {
			store.clearAll();
			window.location.href = `/login`;
		}

		if (process.env.NODE_ENV === "development"){

			console.log(error.response)
		}
		
		return Promise.reject(error);
			
	} else {
			
		return Promise.reject({
			response: {
					data: {code: 320, message: 'Network connection lost'}}
			}
		)
	}
	
});

// export * from './auth';
export * from './user';
export * from './restaurant';
export * from './review';