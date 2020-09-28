
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './index.module.scss';

export default class IconBtn extends React.Component {

  onClick = (e) => {

    const {
      onClick
    } = this.props;

    if (typeof onClick === 'function') {
      onClick(e);
    }

  }

  render() {

    const {
      className,
      icon,
      disabled = false
    } = this.props;

    return (
      <button
        className={classNames({
          [styles.wrap]: true,
          [className]: !!className?.length
        })}
        disabled={disabled}
        onClick={this.onClick}>

        <i className={`fe fe-${icon}`} />

      </button>
    );

  }

}
