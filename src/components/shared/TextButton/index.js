
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './index.module.scss';

export default class TextButton extends React.Component {

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
      label,
      disabled = false,
      outline = false,
      small = false,
      large = false,
    } = this.props;

    console.log({
      label,
      className
    });

    return (
      <button
        disabled={disabled}
        className={classNames({
          [styles.wrap]: true,
          [styles.small]: small,
          [styles.large]: large && !small,
          [styles.outline]: outline,
          [className]: className?.length
        })}
        onClick={this.onClick}>

        {label}

      </button>
    );

  }

}
