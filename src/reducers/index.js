
import { combineReducers } from 'redux';

import {
  mode,
  projects,
  templates,
  beads
} from 'reducers/app';

import {
  project,
  brushIndex,
  beadIndex
} from 'reducers/design';

const rootReducer = combineReducers({
  mode,
  projects,
  templates,
  beads,
  project,
  brushIndex,
  beadIndex
});

export default rootReducer;
