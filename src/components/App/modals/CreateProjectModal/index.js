
import * as React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';

import { generateDesign, encodeDesign } from '~/utils';
import Modal from '~/components/shared/Modal';
import styles from './index.module.scss';

class CreateProjectModal extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      name: 'Project name',
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

    const projectsRef = firebase.database().ref('projects');
    const newProjectRef = projectsRef.push({
      name,
      templateId,
      design: encodeDesign(design)
    }, (error, ref) => {
      if (error) {
        console.log(error);
      }
    });

    window.location.hash = `#/project/${newProjectRef.key}`;

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
                  {opt.label} ({opt.min} - {opt.max})
                </label>

                <input
                  type='text'
                  name={`opt-${opt.id}`}
                  value={values[opt.id]}
                  onChange={(e) => this.onTemplateOptChange(opt.id, e.target.value)} />

              </div>
            );
          })}

          <div className={styles.buttons}>
            <button
              onClick={this.onCancel}>
              Cancel
            </button>
            <button
              onClick={this.onSave}
              className={styles.default}>
              Save
            </button>
          </div>
        </div>

      </Modal>
    );

  }

}

export default connect((state) => ({
  templates: state.templates
}))(CreateProjectModal);
