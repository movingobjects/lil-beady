
import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from 'selectors';

class ZoomControls extends React.Component {

  onZoomInClick = (e) => {

    this.props.dispatch({
      type: 'zoomIn'
    });

  }
  onZoomOuClick = (e) => {

    this.props.dispatch({
      type: 'zoomOut',
    });

  }

  render() {

    const {
      canZoomIn,
      canZoomOut
    } = this.props;

    return (
      <section id='zoom-controls'>

        <div className='wrap-btns'>
          <button
            disabled={!canZoomIn}
            className='zoom-in'
            onClick={this.onZoomInClick}>
            +
          </button>
          <button
            disabled={!canZoomOut}
            className='zoom-out'
            onClick={this.onZoomOuClick}>
            -
          </button>
        </div>

      </section>
    )

  }

}

export default connect((state) => ({
  canZoomIn: selectors.canZoomIn(state),
  canZoomOut: selectors.canZoomOut(state)
}))(ZoomControls)
