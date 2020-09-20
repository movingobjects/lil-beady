
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import styles from './index.module.scss';

export default class LoadAnimation extends React.Component {

  render() {

    const {
      w = 100
    } = this.props;

    return (
      <div
        className={styles.wrap}
        style={{
          width: w
        }}/>
    );

  }

}
