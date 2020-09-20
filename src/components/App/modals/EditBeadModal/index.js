
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

    const {
      beads,
      beadId
    } = props;

    const bead = beads[beadId];

    this.state = {
      name: bead?.name || 'Untitled',
      color: bead?.color || '#fff'
    };

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

  onCancel = () => {

    window.location.hash = '#/dashboard';

  }
  onDelete = () => {

    firebase.database()
      .ref(`beads/${this.props.beadId}`)
      .remove();

    window.location.hash = '#/dashboard';

  }
  onSave = () => {

    const {
      name,
      color
    } = this.state;

    firebase.database()
      .ref(`beads/${this.props.beadId}`)
      .update({ name, color });

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

  componentDidMount() {
    this.setupColorPicker();
  }

  render() {

    const {
      name,
      color
    } = this.state;

    return (

      <Modal
        onTapOff={this.onCancel}>

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
              defaultValue={name}
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
              onClick={this.onCancel}>
              Cancel
            </button>
            <button
              onClick={this.onDelete}>
              Delete
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
  beads: state.beads
}))(EditBeadModal);
