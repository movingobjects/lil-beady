
import * as React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';
import Slider from 'react-rangeslider';
import '~/styles/react-rangeslider.scss';

import { generateDesign, encodeDesign } from '~/utils';
import Modal from '~/components/shared/Modal';
import TextButton from '~/components/shared/TextButton';
import styles from './index.module.scss';

class CreateProjectModal extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      name: '',
      templateId: 'triangle',
      values: { }
    };

  }

  onNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }
  onTemplateSelect = (e) => {
    this.setState({
      templateId: e.target.value
    });
  }

  updateTemplateOpts() {

    const { templateId } = this.state;
    const { templates }  = this.props;

    const template = templates.find((t) => t.id === templateId);

    this.setState({
      values: {
        ...this.state.values,
        ...template.opts.reduce((acc, opt) => ({
          ...acc,
          [opt.id]: opt.default
        }), { })
      }
    });

  };
  onTemplateOptChange = (id, value) => {
    this.setState({
      values: {
        ...this.state.values,
        [id]: Number(value)
      }
    });
  }

  onCancel = () => {

    window.location.hash = '#/dashboard';

  }
  onSave = () => {

    const {
      name,
      templateId
    } = this.state;

    const template = this.props.templates.find((t) => t.id === templateId);
    const design = generateDesign(template, this.getUserOpts());

    const userId = firebase.auth().currentUser?.uid;

    if (userId) {

      const timestamp = (new Date()).toISOString();

      const newProjectKey = firebase.database()
        .ref(`users/${userId}/projects`).push({
          name,
          templateId,
          design: encodeDesign(design),
          dateCreated: timestamp,
          dateLastUpdated: timestamp
        })
        .key;

      window.location.hash = `#/project/${newProjectKey}`;

    } else {
      window.location.hash = `#/dashboard`;

    }

  }

  getUserOpts() {

    const {
      templateId,
      values
    } = this.state;

    const template     = this.props.templates.find((t) => t.id === templateId),
          templateOpts = template ? template.opts : [];

    return templateOpts.reduce((acc, opt) => ({
      ...acc,
      [opt.id]: values.hasOwnProperty(opt.id) ? values[opt.id] : opt.default
    }), { });

  }

  componentDidMount() {
    this.updateTemplateOpts();
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevState.values.templateId !== this.state.values.templateId) {
      this.updateTemplateOpts();
    }

  }

  render() {

    const {
      name,
      templateId,
      values
    } = this.state;

    const {
      templates
    } = this.props;

    const template     = templates.find((t) => t.id === templateId),
          templateOpts = template ? template.opts : [];

    const canSave = (
      !!name.length
    );

    return (

      <Modal
        onTapOff={this.onCancel}>

        <div className={styles.wrap}>

          <h2>Create New Project</h2>

          <div
            className={styles.field}>

            <label
              htmlFor='input-name'>
              Project name
            </label>

            <input
              type='text'
              name='input-name'
              placeholder='Project name'
              value={name}
              onChange={this.onNameChange} />

          </div>

          <div
            className={styles.field}>

            <label
              htmlFor='select-template'>
              Template
            </label>

            <select
              name='select-template'
              value={templateId}
              onChange={this.onTemplateSelect}>
              <option value='triangle'>Triangle</option>
              <option value='square'>Square</option>
              <option value='diamond'>Diamond</option>
            </select>

          </div>

          {templateOpts.map((opt) => {

            if (!values.hasOwnProperty(opt.id)) return null;

            return (
              <div
                key={`opt-${opt.id}`}
                className={styles.field}>

                <label
                  htmlFor={`opt-${opt.id}`}>
                  {opt.label}
                </label>

                <Slider
                  value={values[opt.id]}
                  min={opt.min}
                  max={opt.max}
                  step={1}
                  name={`opt-${opt.id}`}
                  onChange={(value) => this.onTemplateOptChange(opt.id, value)}
                />

              </div>
            );
          })}

          <footer>

            <TextButton
              label='Cancel'
              outline={true}
              onClick={this.onCancel} />

            <TextButton
              label='Create Project'
              disabled={!canSave}
              onClick={this.onSave} />

          </footer>
        </div>

      </Modal>
    );

  }

}

export default connect((state) => ({
  templates: state.templates
}))(CreateProjectModal);
