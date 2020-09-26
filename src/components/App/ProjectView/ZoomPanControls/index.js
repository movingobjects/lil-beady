
import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from '~/selectors';
import styles from './index.module.scss';

import IconZoomIn from '~/components/shared/icons/IconZoomIn';
import IconZoomOut from '~/components/shared/icons/IconZoomOut';

import IconArrowDown from '~/components/shared/icons/IconArrowDown';
import IconArrowLeft from '~/components/shared/icons/IconArrowLeft';
import IconArrowRight from '~/components/shared/icons/IconArrowRight';
import IconArrowUp from '~/components/shared/icons/IconArrowUp';

import IconCircle from '~/components/shared/icons/IconCircle';

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
          <button
            disabled={!canZoomIn}
            className={styles.zoomIn}
            onClick={this.onZoomInClick}>
            <IconZoomIn size={30} color={styles.colorBtnLight} />
          </button>
          <button
            disabled={!canZoomOut}
            className={styles.zoomOut}
            onClick={this.onZoomOuClick}>
            <IconZoomOut size={30} color={styles.colorBtnLight} />
          </button>
        </div>

        <div className={styles.wrapPan}>
          <button
            className={styles.panUp}
            onClick={this.onPanUpClick}>
            <IconArrowUp size={30} color={styles.colorBtnLight} />
          </button>
          <button
            className={styles.panRight}
            onClick={this.onPanRightClick}>
            <IconArrowRight size={30} color={styles.colorBtnLight} />
          </button>
          <button
            className={styles.panDown}
            onClick={this.onPanDownClick}>
            <IconArrowDown size={30} color={styles.colorBtnLight} />
          </button>
          <button
            className={styles.panLeft}
            onClick={this.onPanLeftClick}>
            <IconArrowLeft size={30} color={styles.colorBtnLight} />
          </button>
          <button
            className={styles.resetPan}
            onClick={this.onPanResetClick}>
            <IconCircle size={30} color={styles.colorBtnLight} />
          </button>
        </div>

      </div>
    )

  }

}

export default connect((state) => ({
  canZoomIn: selectors.canZoomIn(state),
  canZoomOut: selectors.canZoomOut(state)
}))(ZoomPanControls)
