
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';
import { map } from 'lodash';
import firebase from 'firebase/app';

import LoginView from './LoginView';
import ProjectView from './ProjectView';
import Dashboard from './Dashboard';
import EditBeadModal from './modals/EditBeadModal';
import CreateBeadModal from './modals/CreateBeadModal';
import CreateProjectModal from './modals/CreateProjectModal';
import EditProjectModal from './modals/EditProjectModal';
import Route from '~/components/Router/Route';

import styles from './index.module.scss';

import { decodeDesign } from '~/utils';

class App extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      user: null,
      authReady: false
    }

  }

  onProjectsUpdate = (projects) => {

    const projectsDecoded = { };

    for (const projectId in projects) {
      projectsDecoded[projectId] = {
        ...projects[projectId],
        design: decodeDesign(projects[projectId]?.design)
      }
    }

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
        this.setState({
          authReady: true,
          user
        });
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

    const {
      user,
      authReady
    } = this.state;

    return (
      <div
        className={styles.wrap}>

        {user ? (
          <>
            <Route path='#/dashboard' component={Dashboard} />
            <Route path='#/dashboard/bead/create' component={CreateBeadModal} />
            <Route path='#/dashboard/bead/edit/:beadId' component={EditBeadModal} />
            <Route path='#/dashboard/create' component={CreateProjectModal} />

            <Route path='#/project/:projectId' component={ProjectView} />
            <Route path='#/project/:projectId/edit' component={EditProjectModal} />
          </>
        ) : (
          <LoginView
            ready={authReady}
            onLoginClick={this.onLoginClick} />
        )}

      </div>
    );

  }

}

export default connect((state) => ({
  project: state.project,
  beads: state.beads,
  beadId: state.beadId
}))(App);
