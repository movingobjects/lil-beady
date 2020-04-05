

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
