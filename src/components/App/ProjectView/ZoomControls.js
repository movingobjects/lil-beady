
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import zoomLevelsData from 'data/zoom-levels.json';

class ZoomControls extends React.Component {

  onZoomInClick = (e) => {

    const {
      dispatch,
      zoomIndex
    } = this.props;

    dispatch({
      type: 'zoomIn'
    });

  }
  onZoomOuClick = (e) => {

    const {
      dispatch,
      zoomIndex
    } = this.props;

    dispatch({
      type: 'zoomOut',
    });

  }

  render() {

    const {
      zoomIndex
    } = this.props;

    return (
      <section id='zoom-controls'>

        <div className='wrap-btns'>
          <button
            disabled={zoomIndex >= zoomLevelsData.length - 1}
            className='zoom-in'
            onClick={this.onZoomInClick}>
            +
          </button>
          <button
            disabled={zoomIndex <= 0}
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
  zoomIndex: state.zoomIndex
}))(ZoomControls)
