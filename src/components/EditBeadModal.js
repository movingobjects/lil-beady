
import * as React from 'react';
import { connect } from 'react-redux';

import iro from '@jaames/iro';
import ModalView from './ModalView';

class EditBeadModal extends React.Component {

  constructor(props) {

    super();

    const {
      beads,
      editBeadId
    } = props;

    let bead = beads.find((b) => b.id === editBeadId);

    this.state = {
      name: bead ? bead.name : 'Untitled',
      color: bead ? bead.color : '#fff'
    }

    this.nameInputRef = React.createRef();

  }

  onTapOff = () => {

    this.props.dispatch({
      type: 'setEditBeadId',
      id: null
    })

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

    this.props.dispatch({
      type: 'setEditBeadId',
      id: null
    });

  }
  onDelete = () => {

    const {
      dispatch,
      editBeadId
    } = this.props;

    dispatch({
      type: 'deleteBead',
      id: editBeadId
    });

    this.props.dispatch({
      type: 'setEditBeadId',
      id: null
    });

  }
  onSave = () => {

    const {
      dispatch,
      editBeadId
    } = this.props;

    const {
      name,
      color
    } = this.state;

    dispatch({
      type: 'updateBead',
      id: editBeadId,
      bead: { name, color }
    });

    dispatch({
      type: 'setEditBeadId',
      id: null
    });

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

      <ModalView
        id='edit-bead-modal'
        onTapOff={this.onTapOff}>

        <h2>Edit Bead</h2>

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
            onClick={this.onDelete}>
            Delete
          </button>
          <button
            onClick={this.onSave}
            className='default'>
            Save
          </button>
        </div>

      </ModalView>

    );

  }

}

export default connect((state) => ({
  beads: state.beads,
  editBeadId: state.editBeadId
}))(EditBeadModal);
