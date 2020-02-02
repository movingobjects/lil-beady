
import { combineReducers } from 'redux';

import {
  brushIndex,
  templates,
  templateIndex
} from 'reducers/design';

const rootReducer = combineReducers({
  brushIndex,
  templates,
  templateIndex
});

export default rootReducer;
