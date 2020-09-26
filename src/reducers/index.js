
import { combineReducers } from 'redux';

import {
  route
} from './router';

import {
  confirm,
  projects,
  templates,
  beads,
  beadId,
  zoomIndex,
  panOffsetX,
  panOffsetY
} from './app';

const rootReducer = combineReducers({
  route,
  confirm,
  projects,
  templates,
  beads,
  beadId,
  zoomIndex,
  panOffsetX,
  panOffsetY
});

export default rootReducer;
