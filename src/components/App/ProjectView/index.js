
import * as React from 'react';
import { connect } from 'react-redux';

import DesignView from './DesignView';
import Toolbar from './Toolbar';
import ZoomControls from './ZoomControls';
import PanControls from './PanControls';

import styles from './index.module.scss';

class ProjectView extends React.Component {

  onBack = () => {

    window.location.hash = `#/dashboard`;

  }

  componentDidMount() {

    this.props.dispatch({
      type: 'resetControls'
    });

  }

  render() {

    const {
      projectId
    } = this.props;

    return (
      <div className={styles.wrap}>

        <div className={styles.menu}>
          <button
            className={styles.back}
            onClick={this.onBack}>
            Back
          </button>
        </div>

        <DesignView
          projectId={projectId} />

        <Toolbar />

        <ZoomControls />
        <PanControls />

      </div>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  templates: state.templates
}))(ProjectView);
