
import * as React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';

import classNames from 'classnames';

import config from '~/config.json';
import styles from './index.module.scss';

class Toolbar extends React.Component {

  onBeadSelect = (id) => {

    this.props.dispatch({
      type: 'setBeadId',
      id
    });

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
                style={{
                  '--color-bead': bead.color
                }}
                onClick={() => this.onBeadSelect(bead.id)}>
                {bead.name}
              </li>
            ))}
          </ul>
        </div>

      </div>
    )

  }

}

export default connect((state) => ({
  beads: state.beads,
  beadId: state.beadId
}))(Toolbar)
