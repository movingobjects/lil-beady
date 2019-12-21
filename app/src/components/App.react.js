
// Imports

import * as React from 'react';
import DesignView from './DesignView.react'
import ToolsView from './ToolsView.react'

import templates from '../data/templates.json';
import beadsLibrary from '../data/beads-library.json';


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
      beadLibrary: beadsLibrary,
      beadLibraryIndex: 0
    }

  }


  // Event handlers


  // Methods

  onToolClick = (tool) => {

    this.setState({ tool });

  }
  onBeadLibraryClick = (beadLibraryIndex) => {

    this.setState({ beadLibraryIndex });

  }


  // React

  render() {

    const {
      tool,
      beadLibrary,
      beadLibraryIndex
    } = this.state;

    return (
      <main>

        <DesignView
          color={beadLibrary[beadLibraryIndex]}
          tool={tool} />

        <ToolsView
          tool={tool}
          beadLibrary={beadLibrary}
          beadLibraryIndex={beadLibraryIndex}
          onToolClick={this.onToolClick}
          onBeadLibraryClick={this.onBeadLibraryClick} />

      </main>
    )

  }

}
