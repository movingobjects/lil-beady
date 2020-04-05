
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
  brushIndex,
  beadIndex
} from './design';

const rootReducer = combineReducers({
  route,
  projects,
  templates,
  beads,
  brushIndex,
  beadIndex
});

export default rootReducer;
