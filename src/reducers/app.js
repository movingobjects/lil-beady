
import projectsData from 'data/projects.json';

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


import beadsData from 'data/beads.json';

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


import templatesData from 'data/templates.json';

export const templates = (state = templatesData, action) => {

  switch (action.type) {

    case 'setTemplates':
      return action.templates;

    default:
      return state;

  }

}
