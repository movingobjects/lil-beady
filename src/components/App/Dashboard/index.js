import * as React from 'react';
import { connect } from 'react-redux';
import { random } from 'varyd-utils';

class Dashboard extends React.Component {

  onProjectCreate = () => {

    const {
      dispatch
    } = this.props;

    // TODO create project

  }

  onProjectSelect = (id) => {

    const {
      projects,
      templates
    } = this.props;

    const project = projects.find((p) => p.id === id);

    if (!project) return;

    window.location.hash = `#/project/${project.id}`;

  }

  onBeadCreate = () => {

    window.location.hash = `#/dashboard/bead/create`;

  }
  onBeadSelect = (id) => {

    window.location.hash = `#/dashboard/bead/edit/${id}`;

  }

  render() {

    const {
      templates,
      projects,
      beads
    } = this.props;

    return (
      <section id='dashboard-view'>

        <h1>Lil Beady</h1>

        <h2>Projects</h2>
        <ul
          className='projects'>

          <li
            className='create'
            onClick={() => this.onProjectCreate()} />

          {projects.map((project, i) => (
            <li
              key={`project-${project.id}`}
              onClick={() => this.onProjectSelect(project.id)}>
              {project.label}
            </li>
          ))}

        </ul>

        <h2>Beads Library</h2>
        <ul
          className='beads'>

          <li
            className='create'
            onClick={() => this.onBeadCreate()} />

          {beads.map((bead, i) => (
            <li
              key={`bead-${bead.id}`}
              style={{
                backgroundColor: bead.color
              }}
              onClick={() => this.onBeadSelect(bead.id)} />
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
