
import * as React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';
import 'firebase/database';
import iro from '@jaames/iro';

import Modal from '~/components/shared/Modal';
import TextButton from '~/components/shared/TextButton';
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
      width: 250,
      height: 250,
      handleRadius: 7,
      sliderMargin: 20,
      layoutDirection: 'horizontal',
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderMargin: 40,
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

            <h4
              htmlFor='input-name'>
              Bead name
            </h4>

            <input
              type='text'
              id='input-name'
              value={name}
              placeholder='Bead name'
              onChange={this.onNameChange} />

          </div>

          <div
            className={styles.field}>

            <h4>Color</h4>

            <div
              className={styles.wrapColorPreview}>
              <div
                className={styles.colorPreview}
                style={{
                  backgroundColor: this.state.color
                }}/>
            </div>

          </div>

          <div
            className={styles.field}>

            <h4>Edit Color</h4>

            <div className={styles.wrapColorPicker}>
              <div id='color-picker'></div>
            </div>
          </div>

          <footer>
            <TextButton
              label='Cancel'
              outline={true}
              onClick={this.onCancel} />

            <TextButton
              label='Add Bead'
              disabled={!canSave}
              onClick={this.onSave} />

          </footer>

        </div>

      </Modal>
    );

  }

}

export default connect((state) => ({

}))(CreateBeadModal);
