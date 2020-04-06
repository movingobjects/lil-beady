
import * as React from 'react';
import { connect } from 'react-redux';
import shortId from 'shortid';
import Select from 'react-select';

import { generateBlankDesign } from 'utils/utils';
import Modal from 'components/shared/Modal';

class CreateProjectModal extends React.Component {

  constructor(props) {

    super();

    this.state = {
      name: 'Project name',
      template: null
    }

    this.nameInputRef = React.createRef();

  }

  onNameChange = (e) => {

    this.setState({
      name: e.target.value
    });

  }

  onTemplateSelect = (template) => {

    this.setState({ template });

  };

  onCancel = () => {

    window.location.hash = '#/dashboard';

  }
  onSave = () => {

    const {
      templates
    } = this.props;

    const projectId = shortId.generate(),
          template  = templates.find((t) => t.id === this.state.template.value),
          design    = generateBlankDesign(template);

    const project = {
      id: projectId,
      name: this.state.name,
      template,
      design
    }

    this.props.dispatch({
      type: 'createProject',
      project
    });

    window.location.hash = `#/project/${projectId}`;

  }

  componentDidMount() {

    const nameInput = this.nameInputRef.current;
    nameInput.focus();
    nameInput.setSelectionRange(0, nameInput.value.length)

  }

  render() {

    const {
      name,
      template
    } = this.state;

    return (

      <Modal
        id='edit-project-modal'
        onTapOutside={this.onCancel}>

        <h2>Create New Project</h2>

        <div
          className='field'>

          <label
            htmlFor='input-name'>
            Bead name
          </label>

          <input
            ref={this.nameInputRef}
            type='text'
            id='input-name'
            defaultValue={name}
            onChange={this.onNameChange} />

        </div>

        <div
          className='field'>

          <label
            htmlFor='input-name'>
            Template
          </label>

          <Select
            isSearchable={false}
            styles={{

              singleValue: (provided, state) => ({
                ...provided,
                fontWeight: 'bold',
                color: '#000'
              }),
              menu: (provided, state) => ({
                ...provided,
                color: state.selectProps.menuColor,
                padding: 10,
                fontSize: 20
              }),
              control: (provided, state) => ({
                ...provided,
                fontSize: 25,
                borderRadius: 8,
                padding: 10
              }),
              valueContainer: (provided, state) => ({
                ...provided,
                padding: 0,
                margin: 0
              }),
              dropdownIndicator: (provided, state) => ({
                ...provided,
                padding: '0 5px 0 10px'
              }),

            }}
            value={template}
            onChange={this.onTemplateSelect}
            options={[
              { label: 'Triangle', value: 'triangle' },
              { label: 'Square', value: 'square' },
              { label: 'Diamond', value: 'diamond' },
            ]} />

        </div>

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
