import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { initialState, reducer } from './reducer'

// initial states here
const initalState = initialState;

// middleware
const middleware = [thunk];

// creating store
export const store = createStore(
  reducer,
  initalState,
  composeWithDevTools(applyMiddleware(...middleware))
);
