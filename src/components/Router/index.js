
import * as React from 'react';
import { connect } from 'react-redux';

class Router extends React.Component {

  onHashChange = () => {

    let route = window.location.hash;

    if (route.charAt(0) === '#') route = route.slice(1);
    if (route.charAt(0) === '/') route = route.slice(1);
    if (route.slice(-1) === '/') route = route.slice(0, -1);

    const segments = route.split('/');

    // TODO: Add project validation here (+ remember to wait til projects are loaded)
    if (segments[0] === 'dashboard') {

    } else if (segments[0] === 'project') {

    } else {
      route = 'dashboard';
    }

    window.location.hash = `#/${route}`;

    this.props.dispatch({
      type: 'setRoute',
      route
    });

  }

  componentDidMount() {

    window.addEventListener('hashchange', this.onHashChange);

    this.onHashChange();

  }
  componentWillUnmount() {

    window.removeEventListener('hashchange', this.onHashChange);

  }

  render() {
    return (
      <>{this.props.children}</>
    );
  }

}

const mapStateToProps = (state) => ({ });

export default connect(mapStateToProps)(Router);
