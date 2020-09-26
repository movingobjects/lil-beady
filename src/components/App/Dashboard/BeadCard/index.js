import * as React from 'react';
import { colors } from 'varyd-utils';

export default class BeadCard extends React.Component {

  onClick = (e) => {

    const { bead } = this.props;

    window.location.hash = `#/dashboard/bead/edit/${bead.id}`;

  }

  render() {

    const {
      bead
    } = this.props;

    return (
      <li
        className={styles.wrap}
        onClick={this.onClick}
        style={{
          backgroundColor: bead.color
        }}>
        <p>{bead.name}</p>
      </li>
    );

  }

}
