
import * as React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import brushesData from 'data/brushes.json';


class Toolbar extends React.Component {

  onBrushSelect = (index) => {

    this.props.dispatch({
      type: 'setBrushIndex',
      index
    });

  }

  onBeadSelect = (index) => {

    this.props.dispatch({
      type: 'setBeadIndex',
      index
    });

  }


  render() {

    const {
      brushIndex,
      beads,
      beadIndex
    } = this.props;

    return (
      <section id="toolbar">

        <div className="tools">
          <ul>
            {brushesData.map((brush, i) => (
              <li
                key={`brush-${brush.id}`}
                className={classNames({
                  'selected': i === brushIndex
                })}
                onClick={() => this.onBrushSelect(i)}>
                {brush.id}
              </li>
            ))}
          </ul>
        </div>

        <div className="beads">
          <ul>
            {beads.map((bead, i) => (
              <li
                key={`${bead.id}`}
                className={classNames({
                  'selected': (i === beadIndex)
                })}
                style={{
                  '--color-bead': bead.color
                }}
                onClick={() => this.onBeadSelect(i)}>
                {bead.name}
              </li>
            ))}
          </ul>
        </div>

      </section>
    )

  }

}

export default connect((state) => ({
  brushIndex: state.brushIndex,
  beads: state.beads,
  beadIndex: state.beadIndex
}))(Toolbar)
