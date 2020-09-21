
import * as React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';

import { generateDesign, encodeDesign } from '~/utils';
import Modal from '~/components/shared/Modal';
import styles from './index.module.scss';

class EditProjectModal extends React.Component {

  constructor(props) {

    super(props);

    const project = props.projects?.[props.projectId];

    this.state = {
      name: project?.name || 'Untitled',
    }

  }

  get project() {

    const {
      projects,
      projectId
    } = this.props;

    return projects[projectId];

  }

  onNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  onCancelClick = () => {

    const {
      projectId
    } = this.props;

    window.location.hash = `#/project/${projectId}`;

  }
  onDeleteClick = () => {

    const projectName = this.project?.name?.length ? `'${this.project.name}'` : 'this project';

    this.props.dispatch({
      type: 'confirmAction',
      message: `Are you sure you want to permanently delete ${projectName}?`,
      description: 'Your project will be lost forever.',
      labelConfirm: 'Yes, delete it',
      onConfirm: this.onDeleteConfirm
    });

  }
  onDeleteConfirm = () => {

    const {
      projectId
    } = this.props;

    firebase.database()
      .ref(`projects/${projectId}`)
      .remove();

    window.location.hash = `#/dashboard`;

  }
  onSaveClick = () => {

    const {
      projectId
    } = this.props;

    firebase.database()
      .ref(`projects/${projectId}`)
      .update({
        name: this.state.name
      });

    window.location.hash = `#/project/${projectId}`;

  }

  componentDidUpdate(prevProps, prevState) {

    const projectPrev = prevProps.projects?.[prevProps.projectId];

    if (!projectPrev && !!this.project) {
      this.setState({
        name: this.project.name
      });
    }

  }

  render() {

    const {
      name
    } = this.state;

    const hasChanged = (
      name !== this.project?.name
    );

    const canSave = (
      hasChanged &&
      !!name.length
    );

    return (
      <Modal
        onTapOff={this.onCancelClick}>

        <div className={styles.wrap}>

          <h2>Edit Project</h2>

          <div
            className={styles.field}>

            <label
              htmlFor='input-name'>
              Project name
            </label>

            <input
              type='text'
              name='input-name'
              value={name}
              onChange={this.onNameChange} />

          </div>

          <div className={styles.buttons}>
            <button
              onClick={this.onCancelClick}>
              Cancel
            </button>
            <button
              onClick={this.onDeleteClick}>
              Delete Project
            </button>
            <button
              className={styles.default}
              disabled={!canSave}
              onClick={this.onSaveClick}>
              Save
            </button>
          </div>

        </div>

      </Modal>
    );
  }

}

export default connect((state) => ({
  projects: state.projects
}))(EditProjectModal);
