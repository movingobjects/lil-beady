
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';

import ProjectView from './ProjectView';
import Dashboard from './Dashboard';
import EditBeadModal from './modals/EditBeadModal';
import CreateBeadModal from './modals/CreateBeadModal';
import CreateProjectModal from './modals/CreateProjectModal';

import Route from 'components/Router/Route';

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

    return (
      <main>

        <Route path='#/dashboard' component={Dashboard} />
        <Route path='#/dashboard/bead/create' component={CreateBeadModal} />
        <Route path='#/dashboard/bead/edit/:beadId' component={EditBeadModal} />
        <Route path='#/dashboard/create' component={CreateProjectModal} />

        <Route path='#/project/:projectId' component={ProjectView} />

      </main>
    )

  }

}

export default connect((state) => ({
  project: state.project,
  beads: state.beads
}))(App);
