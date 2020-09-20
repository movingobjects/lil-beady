
import * as React from 'react';
import { connect } from 'react-redux';

import TextButton from '~/components/shared/TextButton';
import LoadAnimation from '~/components/shared/LoadAnimation';

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

    const {
      ready
    } = this.props;

    return (
      <div className={styles.wrap}>

        <div className={styles.wrapContent}>

          <h1>Lil Beady</h1>

          {ready ? (
            <TextButton
              label='Login'
              outline={true}
              onClick={this.onLoginClick} />
          ) : (
            <LoadAnimation />
          )}

        </div>


      </div>
    );

  }

}

export default connect((state) => ({

}))(LoginView);
