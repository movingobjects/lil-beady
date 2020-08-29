
import { createSelector } from 'reselect';

import config from 'config.json';

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
  (toolIndex) => config.controls.tools[toolIndex]
);

export const getZoomLevel = createSelector(
  getZoomIndex,
  (zoomIndex) => config.controls.zoomLevels[zoomIndex]
);
export const canZoomIn = createSelector(
  getZoomIndex,
  (zoomIndex) => zoomIndex < config.controls.zoomLevels.length - 1
);
export const canZoomOut = createSelector(
  getZoomIndex,
  (zoomIndex) => zoomIndex > 0
);
