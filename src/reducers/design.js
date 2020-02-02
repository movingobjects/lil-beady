
export const brushIndex = (state = 1, action) => {

  switch (action.type) {

    case 'setBrushIndex':
      return action.index;

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

export const templateIndex = (state = 0, action) => {

  switch (action.type) {

    case 'setTemplateIndex':
      return action.index;

    default:
      return state;

  }

}
