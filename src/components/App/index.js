
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';
import firebase from 'firebase/app';
import 'firebase/database';

import ProjectView from './ProjectView';
import Dashboard from './Dashboard';
import EditBeadModal from './modals/EditBeadModal';
import CreateBeadModal from './modals/CreateBeadModal';
import CreateProjectModal from './modals/CreateProjectModal';

import Route from 'components/Router/Route';

class App extends React.Component {

  constructor(props) {

    super(props);

  }

  onKeyDown = (e) => {

    switch (e.key) { }

  }

  onProjectsUpdate = (projects) => {
    this.props.dispatch({
      type: 'setProjects',
      projects
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

  initFirebase() {

    if (!process.env.FIREBASE_API_KEY?.length) {
      throw new Error('No Firebase API key specified in .env file');
      return;
    }

    this.firebase = firebase.initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: "lil-beady.firebaseapp.com",
      databaseURL: "https://lil-beady.firebaseio.com",
      projectId: "lil-beady",
      storageBucket: "lil-beady.appspot.com",
      messagingSenderId: "85532380191",
      appId: "1:85532380191:web:3894c8aebb670c1d9e592a"
    });

    firebase.database()
     .ref('projects')
     .on('value', (data) => this.onProjectsUpdate(data.val()));

    firebase.database()
     .ref('beads')
     .on('value', (data) => this.onBeadsUpdate(data.val()));

  }
  deleteFirebase() {
    if (this.firebase) {
      this.firebase.delete();
    }
  }

  componentDidMount() {
    this.initFirebase();
    document.addEventListener('keydown', this.onKeyDown);
  }
  componentWillUnmount() {
    this.deleteFirebase();
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
  beads: state.beads,
  beadId: state.beadId
}))(App);
