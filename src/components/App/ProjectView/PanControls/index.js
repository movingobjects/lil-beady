
import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from '~/selectors';
import styles from './index.module.scss';

class PanControls extends React.Component {

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

    return (
      <div className={styles.wrap}>

        <div className={styles.wrapBtns}>
          <button
            className={styles.panUp}
            onClick={this.onPanUpClick}>
            &uarr;
          </button>
          <button
            className={styles.panRight}
            onClick={this.onPanRightClick}>
            &rarr;
          </button>
          <button
            className={styles.panDown}
            onClick={this.onPanDownClick}>
            &darr;
          </button>
          <button
            className={styles.panLeft}
            onClick={this.onPanLeftClick}>
            &larr;
          </button>
          <button
            className={styles.resetPan}
            onClick={this.onPanResetClick}>
            &#8982;
          </button>
        </div>

      </div>
    )

  }

}

export default connect((state) => ({

}))(PanControls)
