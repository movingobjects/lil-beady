
import * as React from 'react';
import { connect } from 'react-redux';

import TextButton from '~/components/shared/TextButton';

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

        <div className={styles.wrapContent}>

          <h1>Lil Beady</h1>

          <TextButton
            label='Login'
            outline={true}
            onClick={this.onLoginClick} />

        </div>


      </div>
    );

  }

}

export default connect((state) => ({

}))(LoginView);
