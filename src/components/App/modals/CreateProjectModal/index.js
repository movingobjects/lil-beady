
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import firebase from 'firebase/app';
import 'firebase/database';
import Slider from 'react-rangeslider';
import '~/styles/react-rangeslider.scss';

import { generateDesign, encodeDesign } from '~/utils';
import Modal from '~/components/shared/Modal';
import TemplateIcon from '~/components/shared/TemplateIcon';
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
  onTemplateSelect = (id) => {

    this.setState({
      templateId: id
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

    if (prevState.templateId !== this.state.templateId) {
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

            <ul className={styles.wrapTemplateSelect}>
              {templates.map((t) => (
                <li
                  key={t.id}
                  className={classNames({
                    [styles.selected]: t.id === templateId
                  })}
                  onClick={() => this.onTemplateSelect(t.id)}>
                  <span className={styles.icon}>
                    <TemplateIcon templateId={t.id} />
                  </span>
                  {t.label}
                </li>
              ))}
            </ul>

          </div>

          <div className={styles.wrapTwoCols}>
            {templateOpts.map((opt) => {

              if (!values.hasOwnProperty(opt.id)) return null;

              return (
                <div
                  key={`opt-${opt.id}`}
                  className={styles.field}>

                  <label
                    htmlFor={`opt-${opt.id}`}>
                    <span>{opt.label}</span>
                    <span className={styles.value}>{values[opt.id]}</span>
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
          </div>

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
