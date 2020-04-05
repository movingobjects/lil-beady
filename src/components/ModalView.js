
import * as React from 'react';
import { connect } from 'react-redux';

export default class ModalView extends React.Component {

  render() {

    return (
      <div
        id={this.props.id}
        className='modal-view'>

        <div
          className='bg-cover'
          onClick={() => {
            if (typeof this.props.onTapOff === 'function') {
              this.props.onTapOff();
            }
          }} />

        <div className='panel'>
          {this.props.children}
        </div>

      </div>
    );

  }

}
