
import * as React from 'react';
import { connect } from 'react-redux';
import iro from '@jaames/iro';
import firebase from 'firebase/app';
import 'firebase/database';

import Modal from '~/components/shared/Modal';
import styles from './index.module.scss';

class CreateBeadModal extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      name: '',
      color: '#fff'
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
  onSave = () => {

    const {
      name,
      color
    } = this.state;

    const userId = firebase.auth().currentUser?.uid;

    if (userId) {

      const timestamp = (new Date()).toISOString();

      firebase.database()
        .ref(`users/${userId}/beads`)
        .push({
          name,
          color,
          dateCreated: timestamp,
          dateLastUpdated: timestamp
        });
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

  componentDidMount() {
    this.setupColorPicker();
  }

  render() {

    const {
      name,
      color
    } = this.state;

    const canSave = (
      !!name.length
    );

    return (

      <Modal
        onTapOff={this.onCancel}>

        <div className={styles.wrap}>

          <h2>Add New Bead</h2>

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
              placeholder='Bead name'
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
              className={styles.default}
              disabled={!canSave}
              onClick={this.onSave}>
              Save
            </button>
          </div>

        </div>

      </Modal>
    );

  }

}

export default connect((state) => ({

}))(CreateBeadModal);
