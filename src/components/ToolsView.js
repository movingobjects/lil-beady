
import * as React from 'react';
import { connect } from 'react-redux';

import classNames from 'classnames';

import brushesData from 'data/brushes.json';


class ToolsView extends React.Component {

  constructor() {

    super();

    this.initState();

  }

  initState() {

    this.state = { }

  }


  onBrushSelect = (index) => {

    this.props.dispatch({
      type: 'setBrushIndex',
      index
    });

  }


  render() {

    const {
      brushIndex,
      beadLibrary,
      beadLibraryIndex
    } = this.props;

    return (
      <section id="tools-view">

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

        <div className="bead-library">
          <ul>
            {beadLibrary.map((bead, i) => (
              <li
                key={`${bead.id}`}
                className={classNames({
                  'selected': (i === beadLibraryIndex)
                })}
                style={{
                  '--color-bead': bead.color
                }}
                onClick={() => this.props.onBeadLibraryClick(i)}>
                {bead.label}
              </li>
            ))}
          </ul>
        </div>

      </section>
    )

  }

}

export default connect((state) => ({
  brushIndex: state.brushIndex
}))(ToolsView)
