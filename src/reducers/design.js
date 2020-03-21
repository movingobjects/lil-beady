
import { cloneDeep } from 'lodash';

export const project = (state = null, action) => {

  switch (action.type) {

    case 'setProject':
      return action.project;

    case 'updateBeads':

      const design = cloneDeep(state.design);

      action.beads.forEach((index) => {
        design.beads[index].beadId = action.beadId;
      })

      return {
        ...state,
        design
      };

    default:
      return state;

  }

}

export const brushIndex = (state = 1, action) => {

  switch (action.type) {

    case 'setBrushIndex':
      return action.index;

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
