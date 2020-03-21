
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
