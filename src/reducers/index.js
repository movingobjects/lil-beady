
import { combineReducers } from 'redux';

import {
  templates,
  beads
} from 'reducers/app';

import {
  design,
  brushIndex,
  beadIndex
} from 'reducers/design';

const rootReducer = combineReducers({
  templates,
  beads,
  design,
  brushIndex,
  beadIndex
});

export default rootReducer;
