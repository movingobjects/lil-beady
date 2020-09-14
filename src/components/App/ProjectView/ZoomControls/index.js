
import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from '~/selectors';
import styles from './index.module.scss';

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
      <div className={styles.wrap}>

        <div className={styles.wrapBtns}>
          <button
            disabled={!canZoomIn}
            className={styles.zoomIn}
            onClick={this.onZoomInClick}>
            +
          </button>
          <button
            disabled={!canZoomOut}
            className={styles.zoomOut}
            onClick={this.onZoomOuClick}>
            -
          </button>
        </div>

      </div>
    )

  }

}

export default connect((state) => ({
  canZoomIn: selectors.canZoomIn(state),
  canZoomOut: selectors.canZoomOut(state)
}))(ZoomControls)
