
import beadsData from 'data/beads.json';

export const beads = (state = beadsData, action) => {

  switch (action.type) {

    case 'setBeads':
      return action.beads;

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
