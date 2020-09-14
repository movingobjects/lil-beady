
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './index.module.scss';

export default class TextButton extends React.Component {

  onClick = () => {

    const {
      onClick
    } = this.props;

    if (typeof onClick === 'function') {
      onClick();
    }

  }

  render() {

    const {
      className,
      label,
      outline = false
    } = this.props;

    return (
      <button
        className={classNames({
          [styles.wrap]: true,
          [styles.outline]: outline,
          [className]: className?.length
        })}
        onClick={this.onClick}>

        {label}

      </button>
    );

  }

}
