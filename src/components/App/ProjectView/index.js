
import * as React from 'react';
import { connect } from 'react-redux';

import DesignView from './DesignView';
import Toolbar from './Toolbar';
import ZoomControls from './ZoomControls';

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

        <DesignView
          projectId={projectId} />

        <Toolbar />

        <ZoomControls />

      </section>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  templates: state.templates
}))(ProjectView);
