
import * as React from 'react';
import { connect } from 'react-redux';

import Beads from './Beads';
import Toolbar from './Toolbar';

class ProjectView extends React.Component {

  onBack = () => {

    window.location.hash = `#/dashboard`;

  }

  render() {

    const {
      projectId
    } = this.props;

    return (
      <section id='design-view'>

        <div className='menu'>
          <button
            className='back'
            onClick={this.onBack} />
        </div>

        <Beads
          projectId={projectId} />

        <Toolbar />

      </section>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  templates: state.templates
}))(ProjectView);
