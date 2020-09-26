import * as React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { random } from 'varyd-utils';
import firebase from 'firebase/app';

import ProjectCard from './ProjectCard';
import BeadCard from './BeadCard';
import TextButton from '~/components/shared/TextButton';

import styles from './index.module.scss';

class Dashboard extends React.Component {

  onLogOutClick = (e) => {

    e.preventDefault();

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    firebase.auth().signOut();

  }

  render() {

    const {
      templates = [],
      projects = [],
      beads = []
    } = this.props;

    return (
      <div className={styles.wrap}>

        <div className={styles.topNav}>
          <TextButton
            label='Log out'
            small={true}
            outline={true}
            onClick={this.onLogOutClick} />
        </div>

        <h1>Lil Beady</h1>

        <section className={styles.projects}>
          <h2>Projects</h2>
          <ul>

            <li className={styles.create}>
              <a href={`#/dashboard/create`}>
                Create project
              </a>
            </li>

            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                beads={beads} />
            ))}
          </ul>
        </section>

        <section className={styles.beads}>

          <h2>Beads Library</h2>
          <ul
            className={styles.beads}>

            <li className={styles.create}>
              <a href={`#/dashboard/bead/create`}>
                Create Bead
              </a>
            </li>

            {beads.map((bead) => (
              <BeadCard
                key={bead.id}
                bead={bead} />
            ))}
          </ul>

        </section>

      </div>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  templates: state.templates,
  beads: state.beads
}))(Dashboard);
