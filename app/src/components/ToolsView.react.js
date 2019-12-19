
// Imports

import * as React from 'react';
import * as classNames from 'classnames';


// Constants


// Class

export default class ToolsView extends React.Component {

  // Constructor

  constructor() {

    super();

    this.initState();

  }

  initState() {

    this.state = { }

  }


  // Event handlers


  // Methods


  // React

  render() {

    const {
      tool,
      beadLibrary,
      beadLibraryIndex
    } = this.props;

    return (
      <section id="tools-view">

        <div className="tools">
          <ul>
            <li
              className={classNames({
                'selected': (tool === 'draw')
              })}
              onClick={() => this.props.onToolClick('draw')}
            >
              Draw
            </li>
            <li
              className={classNames({
                'selected': (tool === 'fill')
              })}
              onClick={() => this.props.onToolClick('fill')}
            >
              Fill
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
