
import { createSelector } from 'reselect';

import toolsData from 'data/tools.json';
import zoomLevelsData from 'data/zoom-levels.json';

const getBeads     = (state) => state.beads;
const getBeadIndex = (state) => state.beadIndex;
const getToolIndex = (state) => state.toolIndex;
const getZoomIndex = (state) => state.zoomIndex;

export const getBead = createSelector(
  getBeads,
  getBeadIndex,
  (beads, beadIndex) => beads[beadIndex]
);

export const getTool = createSelector(
  getToolIndex,
  (toolIndex) => toolsData[toolIndex]
);

export const zoomLevel = createSelector(
  getZoomIndex,
  (zoomIndex) => zoomLevelsData[zoomIndex]
);
export const canZoomIn = createSelector(
  getZoomIndex,
  (zoomIndex) => zoomIndex < zoomLevelsData.length - 1
);
export const canZoomOut = createSelector(
  getZoomIndex,
  (zoomIndex) => zoomIndex > 0
);
