
import { createSelector } from 'reselect';

const getBeads     = (state) => state.beads;
const getBeadIndex = (state) => state.beadIndex;

export const getBead = createSelector(
  getBeads,
  getBeadIndex,
  (beads, beadIndex) => beads[beadIndex]
);
