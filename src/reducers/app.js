
import templatesData from 'data/templates.json';
import projectsData from 'data/projects.json';
import beadsData from 'data/beads.json';
import zoomLevelsData from 'data/zoom-levels.json';

export const templates = (state = templatesData, action) => {

  switch (action.type) {

    case 'setTemplates':
      return action.templates;

    default:
      return state;

  }

}

export const projects = (state = projectsData, action) => {

  switch (action.type) {

    case 'setProjects':
      return action.projects;

    case 'createProject':
      return [
        ...state,
        action.project
      ];

    case 'deleteProject':
      return state.filter((p) => p.id !== action.id);

    case 'updateProject':
      return state.map((p) => {
        if (p.id === action.projectId) {
          return {
            ...p,
            ...action.project
          }
        } else {
          return p;
        }
      });

    default:
      return state;

  }

}

export const beads = (state = beadsData, action) => {

  switch (action.type) {

    case 'setBeads':
      return action.beads;

    case 'createBead':
      return [
        ...state,
        action.bead
      ];

    case 'deleteBead':
      return state.filter((b) => b.id !== action.beadId);

    case 'updateBead':
      return state.map((bead) => {
        if (bead.id === action.beadId) {
          return {
            ...bead,
            ...action.bead
          }
        } else {
          return bead;
        }
      });

    default:
      return state;

  }

}

export const beadIndex = (state = 0, action) => {

  switch (action.type) {

    case 'setBeadIndex':
      return action.index;

    default:
      return state;

  }

}

export const toolIndex = (state = 0, action) => {

  switch (action.type) {

    case 'setToolIndex':
      return action.index;

    default:
      return state;

  }

}

export const zoomIndex = (state = 1, action) => {

  let index;

  switch (action.type) {

    case 'setZoomIndex':
      return action.index;

    case 'zoomIn':
      if (state < zoomLevelsData.length - 1) {
        return state + 1;
      } else {
        return state;
      }

    case 'zoomOut':
      if (state > 0) {
        return state - 1;
      } else {
        return state;
      }

    default:
      return state;

  }

}
