
import * as React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';

import { generateDesign, encodeDesign } from '~/utils';
import Modal from '~/components/shared/Modal';
import TextButton from '~/components/shared/TextButton';
import styles from './index.module.scss';

class EditProjectModal extends React.Component {

  constructor(props) {

    super(props);

    const project = props.projects.find((p) => p.id === props.projectId);

    this.state = {
      name: project?.name || 'Untitled',
      useDarkBg: !!project?.useDarkBg
    }

  }

  get project() {

    const {
      projects,
      projectId
    } = this.props;

    return projects.find((p) => p.id === projectId);

  }

  onNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }
  onUseDarkBgChange = (e) => {
    this.setState({
      useDarkBg: e.target.checked
    });
  }

  onCancelClick = () => {

    const {
      projectId
    } = this.props;

    window.location.hash = `#/project/${projectId}`;

  }
  onDeleteClick = () => {

    const projectName = this.project?.name?.length ? `"${this.project.name}"` : 'this project';

    this.props.dispatch({
      type: 'confirmAction',
      message: `Are you sure you want to permanently delete ${projectName}?`,
      labelConfirm: 'Yes, Delete It',
      onConfirm: this.onDeleteConfirm
    });

  }
  onDeleteConfirm = () => {

    const userId    = firebase.auth().currentUser?.uid,
          projectId = this.props.projectId;

    if (userId) {
      firebase.database()
        .ref(`users/${userId}/projects/${projectId}`)
        .remove();
    }

    window.location.hash = `#/dashboard`;

  }
  onSaveClick = () => {

    const userId    = firebase.auth().currentUser?.uid,
          projectId = this.props.projectId;

    if (userId) {
      firebase.database()
        .ref(`users/${userId}/projects/${projectId}`)
        .update({
          name: this.state.name,
          useDarkBg: !!this.state.useDarkBg,
          dateLastUpdated: (new Date()).toISOString()
        });

      window.location.hash = `#/project/${projectId}`;

    } else {
      window.location.hash = `#/dashboard`;
    }

  }

  componentDidUpdate(prevProps, prevState) {

    const projectPrev = prevProps.projects.find((p) => p.id === prevProps.projectId);

    if (!projectPrev && !!this.project) {
      this.setState({
        name: this.project.name,
        useDarkBg: this.project.useDarkBg
      });
    }

  }

  render() {

    const {
      name,
      useDarkBg
    } = this.state;

    const hasChanged = (
      name !== this.project?.name ||
      useDarkBg !== this.project?.useDarkBg
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

            <h4>
              Project name
            </h4>

            <input
              type='text'
              name='input-name'
              value={name}
              onChange={this.onNameChange} />

          </div>

          <div
            className={styles.field}>

            <h4>
              Background
            </h4>

            <label className={styles.wrapToggle}>
              <input
                checked={useDarkBg}
                type='checkbox'
                onChange={this.onUseDarkBgChange} />
              <div className={styles.toggle}>
                <i className={`fe fe-check`} />
              </div>
              <span>Use Dark Background</span>
            </label>

          </div>

          <footer>

            <TextButton
              label='Delete'
              outline={true}
              className={styles.deleteBtn}
              onClick={this.onDeleteClick} />

            <TextButton
              label='Cancel'
              outline={true}
              onClick={this.onCancelClick} />

            <TextButton
              label='Save Project'
              disabled={!canSave}
              onClick={this.onSaveClick} />

          </footer>

        </div>

      </Modal>
    );
  }

}

export default connect((state) => ({
  projects: state.projects
}))(EditProjectModal);
