
export const route = (state = '', action) => {

  switch (action.type) {

    case 'setRoute':
      return action.route;

    default:
      return state;

  }

}
