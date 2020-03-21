
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
