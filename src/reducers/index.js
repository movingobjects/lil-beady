
import { combineReducers } from 'redux';

import {
  brushIndex,
  templates,
  templateIndex
} from 'reducers/design';

import {
  beads,
  beadIndex
} from 'reducers/beads';

const rootReducer = combineReducers({
  brushIndex,
  templates,
  templateIndex,
  beads,
  beadIndex
});

export default rootReducer;
