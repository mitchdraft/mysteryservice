import { createStore, combineReducers, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { topReducer } from "./clue/reducers";
import { logsReducer } from "./log/reducers";

export const host = `${
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:12080"
}`;

const rootReducer = combineReducers({
  top: topReducer,
  logs: logsReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export function configureStore() {
  const middlewares = [thunkMiddleware];
  const middleWareEnhancer = applyMiddleware(...middlewares);

  const store = createStore(
    rootReducer,
    composeWithDevTools(middleWareEnhancer)
  );

  return store;
}
