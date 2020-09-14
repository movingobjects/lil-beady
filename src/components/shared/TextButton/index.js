
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
      outline = false,
      small = false
    } = this.props;

    return (
      <button
        className={classNames({
          [styles.wrap]: true,
          [styles.small]: small,
          [styles.outline]: outline,
          [className]: className?.length
        })}
        onClick={this.onClick}>

        {label}

      </button>
    );

  }

}
