
import * as React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

const TOOLS = [
  { id: 'draw', 'label': 'Draw' },
  { id: 'fill', 'label': 'Fill' }
]

class Toolbar extends React.Component {

  onToolSelect = (index) => {

    this.props.dispatch({
      type: 'setToolIndex',
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
      toolIndex,
      beads,
      beadIndex
    } = this.props;

    return (
      <section id="toolbar">

        <div className="tools">
          <ul>
            {TOOLS.map((tool, i) => (
              <li
                key={`tool-${tool.id}`}
                className={classNames({
                  'selected': i === toolIndex
                })}
                onClick={() => this.onToolSelect(i)}>
                {tool.label}
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
  toolIndex: state.toolIndex,
  beads: state.beads,
  beadIndex: state.beadIndex
}))(Toolbar)
