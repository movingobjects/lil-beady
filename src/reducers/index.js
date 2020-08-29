
import { combineReducers } from 'redux';

import {
  route
} from './router';

import {
  projects,
  templates,
  beads,
  toolIndex,
  beadIndex,
  zoomIndex,
  panOffsetX,
  panOffsetY
} from './app';

const rootReducer = combineReducers({
  route,
  projects,
  templates,
  beads,
  toolIndex,
  beadIndex,
  zoomIndex,
  panOffsetX,
  panOffsetY
});

export default rootReducer;
