
import * as React from 'react';
import { connect } from 'react-redux';
import shortId from 'shortid';

import iro from '@jaames/iro';
import Modal from 'components/shared/Modal';

class CreateBeadModal extends React.Component {

  constructor(props) {

    super();

    this.state = {
      name: 'Bead name',
      color: '#fff'
    }

    this.nameInputRef = React.createRef();

  }

  onTapOutside = () => {

    window.location.hash = '#/dashboard';

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

    this.props.dispatch({
      type: 'createBead',
      bead: {
        id: shortId.generate(),
        name,
        color
      }
    });

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

    const nameInput = this.nameInputRef.current;
    nameInput.focus();
    nameInput.setSelectionRange(0, nameInput.value.length)

  }

  render() {

    const {
      name,
      color
    } = this.state;

    return (

      <Modal
        id='edit-bead-modal'
        onTapOutside={this.onTapOutside}>

        <h2>Add New Bead</h2>

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

          <label>Color</label>

          <div
            className='wrap-color-preview'>
            <div
              className='color-preview'
              style={{
                backgroundColor: this.state.color
              }}/>
          </div>

          <div id='color-picker'></div>

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

}))(CreateBeadModal);
