
import * as React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';

import classNames from 'classnames';

import IconButton from '~/components/shared/IconButton';

import config from '~/config.json';
import styles from './index.module.scss';

class Palette extends React.Component {

  onBeadSelect = (id) => {

    this.props.dispatch({
      type: 'setBeadId',
      id
    });

  }

  onClearClick = () => {
    const { onClear } = this.props;

    if (typeof onClear === 'function') {
      onClear();
    }
  }

  render() {

    const {
      beads,
      beadId
    } = this.props;

    return (
      <div className={styles.wrap}>

        <div className={styles.beads}>
          <ul>
            {beads.map((bead) => (
              <li
                key={`${bead.id}`}
                className={classNames({
                  [styles.selected]: (bead.id === beadId)
                })}
                onClick={() => this.onBeadSelect(bead.id)}>

                <div
                  className={styles.swatch}
                  style={{
                    backgroundColor: bead.color
                  }}>
                  {bead.name}
                </div>

              </li>
            ))}
          </ul>
        </div>

        <IconButton
          icon='x'
          className={styles.clear}
          onClick={this.onClearClick} />

      </div>
    )

  }

}

export default connect((state) => ({
  beads: state.beads,
  beadId: state.beadId
}))(Palette)
