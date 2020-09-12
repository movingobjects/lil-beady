
import * as React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';

import { generateLayout, encodeProject } from 'utils';
import Modal from 'components/shared/Modal';

class CreateProjectModal extends React.Component {

  constructor(props) {

    super();

    this.state = {
      name: 'Project name',
      templateId: 'triangle',
      values: { }
    }

    this.nameInputRef = React.createRef();

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
    const project = {
      name,
      templateId: templateId,
      layout: generateLayout(template, this.getUserOpts())
    };
    const projectEncoded = encodeProject(project);

    const projectsRef = firebase.database().ref('projects');
    const newProjectRef = projectsRef.push(projectEncoded, (error, ref) => {
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

    const nameInput = this.nameInputRef.current;
    nameInput.focus();
    nameInput.setSelectionRange(0, nameInput.value.length)

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
        id='edit-project-modal'
        onTapOutside={this.onCancel}>

        <h2>Create New Project</h2>

        <div
          className='field'>

          <label
            htmlFor='input-name'>
            Project name
          </label>

          <input
            ref={this.nameInputRef}
            type='text'
            name='input-name'
            value={name}
            onChange={this.onNameChange} />

        </div>

        <div
          className='field'>

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
              className='field'>

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

        <div className='buttons'>
          <button
            onClick={this.onCancel}>
            Cancel
          </button>
          <button
            onClick={this.onSave}
            className='default'>
            Save
          </button>
        </div>

      </Modal>
    );

  }

}

export default connect((state) => ({
  templates: state.templates
}))(CreateProjectModal);
