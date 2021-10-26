import { createStore } from "redux";
import reducers from "./reducers";

const configureStore = (initialState) => {
    const store = createStore (reducers, initialState);
    return store;
}

export default configureStore;