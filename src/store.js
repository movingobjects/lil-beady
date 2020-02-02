
import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';

import rootReducer from 'reducers';

const isDevMode        = process.env.NODE_ENV === 'development',
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [];

if (isDevMode) {
  const { createLogger } = require('redux-logger');
  middleware.push(createLogger({
    collapsed: false
  }));
}

const store = createStore(
  rootReducer,
  { },
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
