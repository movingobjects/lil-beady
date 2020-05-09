
import { createSelector } from 'reselect';

import toolsData from 'data/tools.json';

const getBeads     = (state) => state.beads;
const getBeadIndex = (state) => state.beadIndex;
const getToolIndex = (state) => state.toolIndex;

export const getBead = createSelector(
  getBeads,
  getBeadIndex,
  (beads, beadIndex) => beads[beadIndex]
);

export const getTool = createSelector(
  getToolIndex,
  (toolIndex) => toolsData[toolIndex]
);
