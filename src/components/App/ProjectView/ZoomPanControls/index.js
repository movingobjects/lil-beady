
import * as React from 'react';
import { connect } from 'react-redux';

import IconButton from '~/components/shared/IconButton';

import * as selectors from '~/selectors';
import styles from './index.module.scss';

class ZoomPanControls extends React.Component {

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

  onPanUpClick = (e) => {
    this.props.dispatch({
      type: 'panUp'
    });
  }
  onPanRightClick = (e) => {
    this.props.dispatch({
      type: 'panRight',
    });
  }
  onPanDownClick = (e) => {
    this.props.dispatch({
      type: 'panDown',
    });
  }
  onPanLeftClick = (e) => {
    this.props.dispatch({
      type: 'panLeft',
    });
  }

  onPanResetClick = (e) => {
    this.props.dispatch({
      type: 'resetPan',
    });
  }

  render() {

    const {
      canZoomIn,
      canZoomOut
    } = this.props;

    return (
      <div className={styles.wrap}>

        <div className={styles.wrapZoom}>

          <IconButton
            icon='zoom-in'
            className={styles.zoomIn}
            disabled={!canZoomIn}
            onClick={this.onZoomInClick} />

          <IconButton
            icon='zoom-out'
            className={styles.zoomOut}
            disabled={!canZoomOut}
            onClick={this.onZoomOuClick} />

        </div>

        <div className={styles.wrapPan}>
          <IconButton
            icon='arrow-up'
            className={styles.panUp}
            onClick={this.onPanUpClick} />
          <IconButton
            icon='arrow-right'
            className={styles.panRight}
            onClick={this.onPanRightClick} />
          <IconButton
            icon='arrow-down'
            className={styles.panDown}
            onClick={this.onPanDownClick} />
          <IconButton
            icon='arrow-left'
            className={styles.panLeft}
            onClick={this.onPanLeftClick} />

          <IconButton
            icon='disc'
            className={styles.resetPan}
            onClick={this.onPanResetClick} />

        </div>

      </div>
    )

  }

}

export default connect((state) => ({
  canZoomIn: selectors.canZoomIn(state),
  canZoomOut: selectors.canZoomOut(state)
}))(ZoomPanControls)
