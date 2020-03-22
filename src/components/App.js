
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';

import DesignView from './DesignView';
import DashboardView from './DashboardView';
import EditBeadView from './EditBeadView';

class App extends React.Component {

  constructor(props) {

    super();

  }

  onKeyDown = (e) => {

    switch (e.key) { }

  }

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  render() {

    const {
      mode,
      editBeadId
    } = this.props;

    return (
      <main>

        {editBeadId && (
          <EditBeadView />
        )}

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
  project: state.project,
  editBeadId: state.editBeadId
}))(App);
