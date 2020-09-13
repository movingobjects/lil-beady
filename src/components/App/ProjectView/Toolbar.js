
import * as React from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';

import classNames from 'classnames';

import config from '~/config.json';

class Toolbar extends React.Component {

  onToolSelect = (index) => {

    this.props.dispatch({
      type: 'setToolIndex',
      index
    });

  }

  onBeadSelect = (id) => {

    this.props.dispatch({
      type: 'setBeadId',
      id
    });

  }

  render() {

    const {
      toolIndex,
      beads,
      beadId
    } = this.props;

    const {
      tools
    } = config.controls;

    return (
      <section id='toolbar'>

        <div className='tools'>
          <ul>
            {tools.map((tool, i) => (
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

        <div className='beads'>
          <ul>
            {map(beads, (bead, beadKey) => (
              <li
                key={`${beadKey}`}
                className={classNames({
                  'selected': (beadKey === beadId)
                })}
                style={{
                  '--color-bead': bead.color
                }}
                onClick={() => this.onBeadSelect(beadKey)}>
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
  beadId: state.beadId
}))(Toolbar)
