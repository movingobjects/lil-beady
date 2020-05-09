
import { combineReducers } from 'redux';

import {
  route
} from './router';

import {
  projects,
  templates,
  beads
} from './app';

import {
  toolIndex,
  beadIndex
} from './design';

const rootReducer = combineReducers({
  route,
  projects,
  templates,
  beads,
  toolIndex,
  beadIndex
});

export default rootReducer;
