import * as React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { random } from 'varyd-utils';

import firebase from 'firebase/app';

import styles from './index.module.scss';

class Dashboard extends React.Component {

  onSignOutClick = (e) => {

    e.preventDefault();

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    firebase.auth().signOut();

  }

  render() {

    const {
      templates,
      projects,
      beads
    } = this.props;

    return (
      <div className={styles.wrap}>

        <h1>Lil Beady</h1>

        <p>
          <a
            href='#'
            onClick={this.onSignOutClick}>
            Sign out
          </a>
        </p>

        <h2>Projects</h2>
        <ul
          className={styles.projects}>

          <li>
            <a href={`#/dashboard/create`}>
              Create project
            </a>
          </li>

          {map(projects, (project, projectId) => (
            <li key={projectId}>
              <a href={`#/project/${projectId}`}>
                {project.name}
              </a>
            </li>
          ))}

        </ul>

        <h2>Beads Library</h2>
        <ul
          className={styles.beads}>

          <li>
            <a href={`#/dashboard/bead/create`}>
              Add Bead
            </a>
          </li>

          {map(beads, (bead, beadId) => (
            <li key={beadId}>
              <a
                style={{
                  backgroundColor: bead.color
                }}
                href={`#/dashboard/bead/edit/${beadId}`}>
                {bead.name}
              </a>

            </li>
          ))}
        </ul>

      </div>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  templates: state.templates,
  beads: state.beads
}))(Dashboard);
