
import * as React from 'react';
import { connect } from 'react-redux';

class Route extends React.Component {

  getSegments(route) {

    if (route.charAt(0) === '#') route = route.slice(1);
    if (route.charAt(0) === '/') route = route.slice(1);
    if (route.slice(-1) === '/') route = route.slice(0, -1);

    return route.split('/')

  }

  update() {

    const {
      route,
      path
    } = this.props;

    const result = {
      on: true,
      props: { }
    };

    const routeSegs = this.getSegments(route),
          pathSegs  = this.getSegments(path);

    pathSegs.forEach((pathSeg, index) => {

      if (!result.on) return;

      const routeSeg = routeSegs[index];

      if (pathSeg.charAt(0) === ':') {
        result.props[pathSeg.slice(1)] = routeSeg;

      } else if (routeSeg !== pathSeg) {
        result.on = false;
      }

    });

    return result;

  }

  render() {

    const {
      on,
      props
    } = this.update();

    if (!on) return null;

    const Component = this.props.component;

    return (
      <Component {...props} />
    );

  }

}

const mapStateToProps = (state) => ({
  route: state.route
});

export default connect(mapStateToProps)(Route);
