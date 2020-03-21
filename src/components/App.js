
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';

import DesignView from './DesignView';
import DashboardView from './DashboardView';

class App extends React.Component {

  constructor(props) {

    super();

  }

  onKeyDown = (e) => {

    switch (e.key) {

      case 'p':
        console.log(JSON.stringify(this.props.project));
        break;
      
    }

  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {

    const {
      mode
    } = this.props;

    return (
      <main>

        {mode === 'dashboard' && (
          <DashboardView />
        )}

        {mode === 'design' && (
          <DesignView />
        )}

      </main>
    )

  }

}

export default connect((state) => ({
  mode: state.mode,
  project: state.project
}))(App);
