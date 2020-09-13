
import * as React from 'react';
import { connect } from 'react-redux';

import * as selectors from '~/selectors';

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
      <section id='pan-controls'>

        <div className='wrap-btns'>
          <button
            className='pan-up'
            onClick={this.onPanUpClick}>
            &uarr;
          </button>
          <button
            className='pan-right'
            onClick={this.onPanRightClick}>
            &rarr;
          </button>
          <button
            className='pan-down'
            onClick={this.onPanDownClick}>
            &darr;
          </button>
          <button
            className='pan-left'
            onClick={this.onPanLeftClick}>
            &larr;
          </button>
          <button
            className='reset-pan'
            onClick={this.onPanResetClick}>
            &#8982;
          </button>
        </div>

      </section>
    )

  }

}

export default connect((state) => ({

}))(PanControls)
