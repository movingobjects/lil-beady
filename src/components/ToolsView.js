
import * as React from 'react';
import { connect } from 'react-redux';

import * as classNames from 'classnames';


class ToolsView extends React.Component {

  constructor() {

    super();

    this.initState();

  }

  initState() {

    this.state = { }

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
            <li
              className={classNames({
                'selected': (brushIndex === 0)
              })}
              onClick={() => this.props.onBrushSelect(0)}>
              Small
            </li>
            <li
              className={classNames({
                'selected': (brushIndex === 1)
              })}
              onClick={() => this.props.onBrushSelect(1)}>
              Big
            </li>
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
                onClick={() => this.props.onBeadLibraryClick(i)}
              >
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
