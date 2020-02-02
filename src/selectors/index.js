
import { createSelector } from 'reselect';

const getTemplates     = (state) => state.templates;
const getTemplateIndex = (state) => state.templateIndex;

export const getTemplate = createSelector(
  getTemplates,
  getTemplateIndex,
  (templates, templateIndex) => templates[templateIndex]
);
