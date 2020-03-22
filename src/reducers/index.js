
import { combineReducers } from 'redux';

import {
  projects,
  templates,
  beads,
  mode,
  createBeadOn,
  editBeadId
} from 'reducers/app';

import {
  project,
  brushIndex,
  beadIndex
} from 'reducers/design';

const rootReducer = combineReducers({
  projects,
  templates,
  beads,
  mode,
  createBeadOn,
  editBeadId,
  project,
  brushIndex,
  beadIndex
});

export default rootReducer;
