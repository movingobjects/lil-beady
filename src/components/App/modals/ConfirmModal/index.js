
import * as React from 'react';
import { connect } from 'react-redux';

import Modal from '~/components/shared/Modal';
import TextButton from '~/components/shared/TextButton';

import style from './index.module.scss';

class ConfirmModal extends React.Component {

  onConfirm = () => {

    const {
      dispatch,
      onConfirm
    } = this.props;

    dispatch({ type: 'closeConfirm' });

    if (typeof onConfirm === 'function') {
      onConfirm();
    }

  }
  onCancel = () => {

    const {
      dispatch,
      onCancel
    } = this.props;

    dispatch({ type: 'closeConfirm' });

    if (typeof onCancel === 'function') {
      onCancel();
    }

  }

  render() {

    const {
      message,
      description = null,
      labelCancel = 'Cancel',
      labelConfirm = 'Okay'
    } = this.props;

    return (
      <Modal
        w={500}
        onTapOff={this.onCancel}>

        <div className={style.wrap}>

          {!!message?.length && (
            <p className={style.message}>{message}</p>
          )}

          {!!description?.length && (
            <p className={style.description}>{description}</p>
          )}

          <footer>

            <TextButton
              label={labelCancel}
              outline={true}
              onClick={this.onCancel} />

            <TextButton
              label={labelConfirm}
              onClick={this.onConfirm} />

          </footer>

        </div>

      </Modal>
    );

  }

}

export default connect((state) => ({

}))(ConfirmModal);
