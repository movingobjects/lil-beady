
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './index.module.scss';

export default class Modal extends React.Component {

  onTapOff = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const {
      onTapOff
    } = this.props;

    if (typeof onTapOff === 'function') {
      onTapOff();
    }

  }

  render() {

    const {
      className
    } = this.props;

    return (
      <div
        className={classNames({
          [styles.wrap]: true,
          [className]: className?.length
        })}>

        <div
          className={styles.cover}
          onClick={this.onTapOff} />

        <div
          className={styles.panel}>

          {this.props.children}

        </div>

      </div>
    );

  }

}
