
import * as React from 'react';
import { connect } from 'react-redux';

import styles from './index.module.scss';

class LoginView extends React.Component {

  onLoginClick = () => {

    const {
      onLoginClick
    } = this.props;

    if (typeof onLoginClick === 'function') {
      onLoginClick();
    }

  }

  render() {

    return (
      <div className={styles.wrap}>

        <button
          onClick={this.onLoginClick}>
          Login
        </button>

      </div>
    );

  }

}

export default connect((state) => ({

}))(LoginView);
