
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';
import firebase from 'firebase/app';

import LoginView from './LoginView';
import ProjectView from './ProjectView';
import Dashboard from './Dashboard';
import EditBeadModal from './modals/EditBeadModal';
import CreateBeadModal from './modals/CreateBeadModal';
import CreateProjectModal from './modals/CreateProjectModal';

import { decodeProject } from 'utils';

import Route from 'components/Router/Route';

class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      user: null
    }

  }

  onProjectsUpdate = (projects) => {

    const projectsDecoded = { };

    Object.keys(projects).forEach((key) => {
      projectsDecoded[key] = decodeProject(projects[key]);
    })

    this.props.dispatch({
      type: 'setProjects',
      projects: projectsDecoded
    });
  }
  onBeadsUpdate = (beads) => {

    const {
      dispatch,
      beadId,
    } = this.props;

    dispatch({
      type: 'setBeads',
      beads
    });

    // If no bead id has been set, set it to the first bead's id
    if (!beadId) {
      dispatch({
        type: 'setBeadId',
        id: Object.keys(beads)[0]
      });
    }

  }

  onLoginClick = () => {

    let provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithRedirect(provider);

  }

  initFirebase() {

    firebase.auth()
      .onAuthStateChanged((user) => {
        this.setState({ user });
      });

    firebase.database()
      .ref('beads')
      .on('value', (data) => this.onBeadsUpdate(data.val()));

    firebase.database()
      .ref('projects')
      .on('value', (data) => this.onProjectsUpdate(data.val()));

  }
  deleteFirebase() {
    if (this.firebase) {
      this.firebase.delete();
    }
  }

  componentDidMount() {
    this.initFirebase();
  }
  componentWillUnmount() {
    this.deleteFirebase();
  }

  render() {

    const { user } = this.state;

    if (!user) {
      return (
        <LoginView
          onLoginClick={this.onLoginClick} />
      );
    }

    return (
      <main>

        <Route path='#/dashboard' component={Dashboard} />
        <Route path='#/dashboard/bead/create' component={CreateBeadModal} />
        <Route path='#/dashboard/bead/edit/:beadId' component={EditBeadModal} />
        <Route path='#/dashboard/create' component={CreateProjectModal} />

        <Route path='#/project/:projectId' component={ProjectView} />

      </main>
    );

  }

}

export default connect((state) => ({
  project: state.project,
  beads: state.beads,
  beadId: state.beadId
}))(App);
