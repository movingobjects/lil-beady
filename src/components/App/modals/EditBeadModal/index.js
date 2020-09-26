
import * as React from 'react';
import { connect } from 'react-redux';
import { find } from 'lodash';
import iro from '@jaames/iro';
import firebase from 'firebase/app';
import 'firebase/database';

import Modal from '~/components/shared/Modal';
import styles from './index.module.scss';

class EditBeadModal extends React.Component {

  constructor(props) {

    super(props);

    const bead = props.beads?.[props.beadId];

    this.state = {
      name: bead?.name || '',
      color: bead?.color || '#fff'
    };

  }

  get bead() {

    const {
      beads,
      beadId
    } = this.props;

    return beads[beadId];

  }

  onNameChange = (e) => {

    this.setState({
      name: e.target.value
    });

  }
  onColorChange = (e) => {

    this.setState({
      color: e.hexString
    });

  }

  onCancelClick = () => {

    window.location.hash = '#/dashboard';

  }
  onDeleteClick = () => {

    this.props.dispatch({
      type: 'confirmAction',
      message: 'Are you sure you want to permanently delete this bead?',
      labelConfirm: 'Yes, delete it',
      onConfirm: this.onDeleteConfirm
    });

  }
  onDeleteConfirm = () => {

    firebase.database()
      .ref(`beads/${this.props.beadId}`)
      .remove();

    window.location.hash = '#/dashboard';

  }
  onSaveClick = () => {

    const {
      name,
      color
    } = this.state;

    const user   = firebase.auth().currentUser,
          beadId = this.props.beadId;

    if (user) {
      firebase.database()
        .ref(`users/${user.uid}/beads/${beadId}`)
        .update({ name, color });
    }

    window.location.hash = '#/dashboard';

  }

  setupColorPicker() {

    const opts = {
      color: this.state.color,
      display: 'inline-block',
      width: 300,
      height: 300,
      sliderMargin: 20,
      handleRadius: 10,
      layoutDirection: 'horizontal',
      layout: [
        {
          component: iro.ui.Wheel,
          options: { }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'hue'
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'saturation'
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'value'
          }
        }
      ]
    };

    this.colorPicker = new iro.ColorPicker('#color-picker', opts);

    this.colorPicker.on('color:change', this.onColorChange);

  }

  resetFields(name = 'Untitled', color = '#fff') {

    this.setState({ name, color });

    this.colorPicker.color.hexString = color;

  }

  componentDidMount() {
    this.setupColorPicker();
  }
  componentDidUpdate(prevProps, prevState) {

    const beadPrev = prevProps.beads?.[prevProps.beadId];

    if (!beadPrev && !!this.bead) {
      this.resetFields(this.bead?.name, this.bead?.color);
    }

  }

  render() {

    const {
      name,
      color
    } = this.state;

    const hasChanged = (
      name !== this.bead?.name ||
      color !== this.bead?.color
    );

    const canSave = (
      hasChanged &&
      !!name.length &&
      !!color.length
    );

    return (

      <Modal
        onTapOff={this.onCancelClick}>

        <div className={styles.wrap}>

          <h2>Edit Bead</h2>

          <div
            className={styles.field}>

            <label
              htmlFor='input-name'>
              Bead name
            </label>

            <input
              type='text'
              id='input-name'
              value={name}
              onChange={this.onNameChange} />

          </div>

          <div
            className={styles.field}>

            <label>Color</label>

            <div
              className={styles.wrapColorPreview}>
              <div
                className={styles.colorPreview}
                style={{
                  backgroundColor: this.state.color
                }}/>
            </div>

            <div id='color-picker'></div>

          </div>

          <div className={styles.buttons}>
            <button
              onClick={this.onCancelClick}>
              Cancel
            </button>
            <button
              onClick={this.onDeleteClick}>
              Delete
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
  beads: state.beads
}))(EditBeadModal);
