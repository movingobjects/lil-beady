
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';
import { map } from 'lodash';
import firebase from 'firebase/app';

import LoginView from './LoginView';
import ProjectView from './ProjectView';
import Dashboard from './Dashboard';
import ConfirmModal from './modals/ConfirmModal';
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

  onProjectsDataUpdate = (data) => {

    const projects = map(data, (project, projectId) => ({
      ...project,
      id: projectId,
      design: decodeDesign(project?.design),
      dateCreated: new Date(project.dateCreated),
      dateLastUpdated: new Date(project.dateLastUpdated)
    })).sort((a, b) => b.dateLastUpdated - a.dateLastUpdated);

    this.props.dispatch({
      type: 'setProjects',
      projects
    });

  }
  onBeadsDataUpdate = (data) => {

    const beads = map(data, (bead, beadId) => ({
      ...bead,
      id: beadId,
      dateCreated: new Date(bead.dateCreated),
      dateLastUpdated: new Date(bead.dateLastUpdated)
    })).sort((a, b) => b.dateCreated - a.dateCreated);

    this.props.dispatch({
      type: 'setBeads',
      beads
    });

    // If no bead id has been set, set it to the first bead's id
    // TODO (maybe this should go in the ProjectView?)
    if (!this.props.beadId) {
      this.props.dispatch({
        type: 'setBeadId',
        id: beads[0]?.id || null
      });
    }

  }

  onLoginClick = () => {

    let provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
      .signInWithRedirect(provider);

  }
  onUserLogin = (user) => {

    const userId = user?.uid;

    firebase.database()
      .ref(`users/${userId}/profile`)
      .update({
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        dateLastLogin: (new Date()).toISOString()
      });

    firebase.database()
      .ref(`users/${userId}/beads`)
      .on('value', (data) => this.onBeadsDataUpdate(data.val()));

    firebase.database()
      .ref(`users/${userId}/projects`)
      .on('value', (data) => this.onProjectsDataUpdate(data.val()));

    this.setState({
      authReady: true,
      user
    });

  }

  initFirebase() {

    firebase.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          this.onUserLogin(user);
        }
      });

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

    const {
      confirm
    } = this.props;

    if (!user) {
      return (
        <div
          className={styles.wrap}>
          <LoginView
            ready={authReady}
            onLoginClick={this.onLoginClick} />
        </div>
      );
    }

    return (
      <div
        className={styles.wrap}>

        <Route path='#/dashboard' component={Dashboard} />
        <Route path='#/dashboard/bead/create' component={CreateBeadModal} />
        <Route path='#/dashboard/bead/edit/:beadId' component={EditBeadModal} />
        <Route path='#/dashboard/create' component={CreateProjectModal} />

        <Route path='#/project/:projectId' component={ProjectView} />
        <Route path='#/project/:projectId/edit' component={EditProjectModal} />

        {confirm && (
          <ConfirmModal {...confirm} />
        )}

      </div>
    );

  }

}

export default connect((state) => ({
  project: state.project,
  beadId: state.beadId,
  confirm: state.confirm
}))(App);
