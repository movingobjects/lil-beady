
import * as React from 'react';
import { connect } from 'react-redux';

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
      <section id='login-view'>

        <button
          onClick={this.onLoginClick}>
          Login
        </button>

      </section>
    );

  }

}

export default connect((state) => ({

}))(LoginView);
