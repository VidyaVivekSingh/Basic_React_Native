import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import countReducer from '../store/reducers/count-reducer';
import appReducer from '../store/reducers/app-reducer';
import userReducer from '../store/reducers/user-reducer';

// const middleware = applyMiddleware(logger, thunk, promise());

const rootReducer = combineReducers({
  counter: countReducer,
  app: appReducer,
  user: userReducer,
});

let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers =
    composeWithDevTools ||
    window.__REDUX_DEV_TOOLS_EXTENSION_COMPOSE__ ||
    compose;
}

const configureStore = () => {
  return createStore(
    rootReducer,
    // composeEnhancers(middleware)
  );
};

export default configureStore;
