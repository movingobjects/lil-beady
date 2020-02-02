
import { createSelector } from 'reselect';


const getTemplates     = (state) => state.templates;
const getTemplateIndex = (state) => state.templateIndex;

export const getTemplate = createSelector(
  getTemplates,
  getTemplateIndex,
  (templates, templateIndex) => templates[templateIndex]
);


const getBeads     = (state) => state.beads;
const getBeadIndex = (state) => state.beadIndex;

export const getBead = createSelector(
  getBeads,
  getBeadIndex,
  (beads, beadIndex) => beads[beadIndex]
);
