
import { createSelector } from 'reselect';

import config from '~/config.json';

const getBeads     = (state) => state.beads;
const getBeadId    = (state) => state.beadId;
const getZoomIndex = (state) => state.zoomIndex;

export const getBead = createSelector(
  getBeads,
  getBeadId,
  (beads, beadId) => beads.find((b) => b.id === beadId)
);
export const getBeadColor = createSelector(
  getBeads,
  getBeadId,
  (beads, beadId) => beads.find((b) => b.id === beadId)?.color
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
