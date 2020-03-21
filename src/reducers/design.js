
import { cloneDeep } from 'lodash';

export const design = (state = { }, action) => {

  switch (action.type) {

    case 'setDesign':
      return action.design;

    case 'updateBeads':

      const design = cloneDeep(state);

      action.beads.forEach((index) => {
        design.beads[index].beadId = action.beadId;
      })

      return design;

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
