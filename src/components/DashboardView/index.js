
import * as React from 'react';
import { connect } from 'react-redux';
import { random } from 'varyd-utils';

import { generateBlankDesign } from 'utils/utils';

class DashboardView extends React.Component {

  onProjectCreate = () => {

    console.log(`Create project!`);

  }

  onProjectOpen = (id) => {

    const {
      dispatch,
      projects,
      templates
    } = this.props;

    const project = projects.find((p) => p.id === id);

    if (!project) return;

    if (!project.design) {

      const template = templates.find((t) => t.id === project.template) || random.item(templates);

      project.design = generateBlankDesign(template);

    }

    dispatch({
      type: 'setProject',
      project
    });

    dispatch({
      type: 'setMode',
      mode: 'design'
    });

  }

  onBeadCreate = () => {
    console.log(`Create bead!`);
  }
  onBeadOpen = (id) => {
    console.log(`Open bead: ${id}!`);
  }

  render() {

    const {
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
              onClick={() => this.onProjectOpen(project.id)}>
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
              onClick={() => this.onBeadOpen(bead.id)} />
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
}))(DashboardView);
