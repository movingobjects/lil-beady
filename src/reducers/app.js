
import templatesData from '~/data/templates.json';
import config from '~/config.json';

export const templates = (state = templatesData, action) => {

  switch (action.type) {

    case 'setTemplates':
      return action.templates;

    default:
      return state;

  }

}

export const projects = (state = [], action) => {

  switch (action.type) {

    case 'setProjects':
      return action.projects;

    default:
      return state;

  }

}

export const beads = (state = [], action) => {

  switch (action.type) {

    case 'setBeads':
      return action.beads;

    default:
      return state;

  }

}
export const beadId = (state = null, action) => {

  switch (action.type) {

    case 'setBeadId':
      return action.id;

    default:
      return state;

  }

}

export const zoomIndex = (state = 1, action) => {

  let index;

  const minIndex = 0,
        maxIndex = config.controls.zoomLevels.length - 1;

  switch (action.type) {

    case 'resetControls':
      return 1;

    case 'setZoomIndex':
      return action.index;

    case 'zoomIn':
      if (state < maxIndex) {
        return state + 1;
      } else {
        return state;
      }

    case 'zoomOut':
      if (state > minIndex) {
        return state - 1;
      } else {
        return state;
      }

    default:
      return state;

  }

}

export const panOffsetX = (state = 0, action) => {

  let index;

  switch (action.type) {

    case 'resetControls':
      return 0;

    case 'resetPan':
      return 0;

    case 'panLeft':
      return state - 1;

    case 'panRight':
      return state + 1;

    default:
      return state;

  }

}
export const panOffsetY = (state = 0, action) => {

  let index;

  switch (action.type) {

    case 'resetControls':
      return 0;

    case 'resetPan':
      return 0;

    case 'panUp':
      return state - 1;

    case 'panDown':
      return state + 1;

    default:
      return state;

  }

}

export const confirm = (state = null, action) => {

  switch (action.type) {

    case 'confirmAction':
      return action;

    case 'closeConfirm':
      return null;

    default:
      return state;

  }

}
