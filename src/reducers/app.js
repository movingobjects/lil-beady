
import projectsData from 'data/projects.json';

export const projects = (state = projectsData, action) => {

  switch (action.type) {

    case 'setProjects':
      return action.projects;

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
      return state.filter((b) => b.id !== action.id);

    case 'updateBead':
      return state.map((bead) => {
        if (bead.id === action.id) {
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


export const mode = (state = 'dashboard', action) => {

  switch (action.type) {

    case 'setMode':
      return action.mode;

    default:
      return state;

  }

}

export const editBeadId = (state = null, action) => {
  
  switch (action.type) {

    case 'setEditBeadId':
      return action.id;
      
    case 'clearEditBeadId':
      return null;

    default:
      return state;

  }
  
}

export const createBeadOn = (state = false, action) => {

  switch (action.type) {

    case 'setCreateBeadOn':
      return action.on;

    default:
      return state;

  }


}