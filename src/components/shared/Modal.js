
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

export default class Modal extends React.Component {

  onTapOutside = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const {
      onTapOutside
    } = this.props;

    if (typeof onTapOutside === 'function') {
      onTapOutside();
    }

  }

  onTapInside = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const {
      onTapInside
    } = this.props;

    if (typeof onTapInside === 'function') {
      onTapInside();
    }

  }

  render() {

    const classes = this.props.classNames || { };

    return (
      <div
        id={this.props.id}
        className={classNames({
          'modal-view': true,
          ...classes
        })}
        onClick={this.onTapOutside}>

        <div
          className='panel'
          onClick={this.onTapInside}>

          {this.props.children}

        </div>

      </div>
    );

  }

}
