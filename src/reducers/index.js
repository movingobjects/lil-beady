
import { combineReducers } from 'redux';

import {
  route
} from './router';

import {
  projects,
  templates,
  beads,
  toolIndex,
  beadIndex
} from './app';

const rootReducer = combineReducers({
  route,
  projects,
  templates,
  beads,
  toolIndex,
  beadIndex
});

export default rootReducer;
