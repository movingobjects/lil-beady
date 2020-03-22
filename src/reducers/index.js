
import { combineReducers } from 'redux';

import {
  projects,
  templates,
  beads,
  mode,
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
  editBeadId,
  project,
  brushIndex,
  beadIndex
});

export default rootReducer;
