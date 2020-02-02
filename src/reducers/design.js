
export const brushIndex = (state = 1, action) => {

  switch (action.type) {

    case 'setBrushIndex':
      return action.index;

    default:
      return state;

  }

}
