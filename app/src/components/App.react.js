
// Imports

import * as React from 'react';
import DesignView from './DesignView.react';
import ToolsView from './ToolsView.react';

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
      appW: 0,
      appH: 0,
      tool: 'draw',
      beadLibrary: beadsLibrary,
      beadLibraryIndex: 0
    }

  }


  // Event handlers

  onResize = () => {
    this.setState({
      appW: window.innerWidth,
      appH: window.innerHeight
    });
  }


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
      appW,
      appH,
      tool,
      beadLibrary,
      beadLibraryIndex
    } = this.state;

    const template = templates[0];

    return (
      <main>

        <ToolsView
          tool={tool}
          beadLibrary={beadLibrary}
          beadLibraryIndex={beadLibraryIndex}
          onToolClick={this.onToolClick}
          onBeadLibraryClick={this.onBeadLibraryClick} />

          <DesignView
            appW={appW}
            appH={appH}
            template={template}
            bead={beadLibrary[beadLibraryIndex]}
            tool={tool} />

      </main>
    )

  }

  componentDidMount() {
    window.addEventListener('resize', () => this.onResize());
    this.onResize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', () => this.onResize());
  }

}
