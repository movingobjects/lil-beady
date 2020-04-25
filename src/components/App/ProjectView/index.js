
import * as React from 'react';
import { connect } from 'react-redux';

import Design from './Design';
import Tools from './Tools';

class ProjectView extends React.Component {

  onBack = () => {

    window.location.hash = `#/dashboard`;

  }

  render() {

    const {
      projectId
    } = this.props;

    return (
      <section id='project-view'>

        <div className='menu'>
          <button
            className='back'
            onClick={this.onBack} />
        </div>

        <Design
          projectId={projectId} />

        <Tools />

      </section>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  templates: state.templates
}))(ProjectView);
