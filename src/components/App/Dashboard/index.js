import * as React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { random } from 'varyd-utils';

class Dashboard extends React.Component {

  render() {

    const {
      templates,
      projects,
      beads
    } = this.props;

    return (
      <section id='dashboard'>

        <h1>Lil Beady</h1>

        <h2>Projects</h2>
        <ul
          className='projects'>

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
          className='beads'>

          <li>
            <a href={`#/dashboard/bead/create`}>
              Add Bead
            </a>
          </li>

          {beads.map((bead, i) => (
            <li
              key={bead.id}>
              <a
                style={{
                  backgroundColor: bead.color
                }}
                href={`#/dashboard/bead/edit/${bead.id}`}>
                {bead.name}
              </a>

            </li>
          ))}
        </ul>

      </section>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  templates: state.templates,
  beads: state.beads
}))(Dashboard);
