
// Imports

import * as React from 'react';
import DesignView from './DesignView.react'
import ToolsView from './ToolsView.react'


// Constants


// Class

export default class App extends React.Component {

  // Constructor

  constructor() {

    super();

    this.initState();

  }

  initState() {

    this.state = {
      tool: 'draw',
      palette: [
        {
          id: 'red',
          label: 'Red',
          color: '#ff6666'
        },
        {
          id: 'orange',
          label: 'Orange',
          color: '#ff9966'
        },
        {
          id: 'yellow',
          label: 'Yellow',
          color: '#ffdd66'
        },
        {
          id: 'green',
          label: 'Green',
          color: '#99cc66'
        },
        {
          id: 'blue',
          label: 'Blue',
          color: '#66ccdd'
        },
        {
          id: 'purple',
          label: 'Purple',
          color: '#cc66ff'
        }
      ],
      paletteIndex: 0
    }

  }


  // Event handlers


  // Methods

  onToolClick = (tool) => {

    this.setState({ tool });

  }
  onPaletteClick = (paletteIndex) => {

    this.setState({ paletteIndex });

  }


  // React

  render() {

    const {
      tool,
      palette,
      paletteIndex
    } = this.state;

    return (
      <main>

        <DesignView
          color={palette[paletteIndex]}
          tool={tool}
        />

        <ToolsView
          tool={tool}
          palette={palette}
          paletteIndex={paletteIndex}
          onToolClick={this.onToolClick}
          onPaletteClick={this.onPaletteClick}
        />

      </main>
    )

  }

}
