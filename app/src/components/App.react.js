
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
      beadLibraryIndex: 0,
      templateIndex: 0
    }

  }


  // Event handlers

  onResize = () => {
    this.setState({
      appW: window.innerWidth,
      appH: window.innerHeight
    });
  }

  onKeyDown = (e) => {

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {

      const offset   = (e.key === 'ArrowLeft') ? -1 : 1,
            newIndex = Math.max(0, Math.min(templates.length - 1, this.state.templateIndex + offset));

      this.setState({
        templateIndex: newIndex
      });

    }

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

    const template = templates[this.state.templateIndex];

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
    document.addEventListener('keydown', this.onKeyDown);

    this.onResize();

  }
  componentWillUnmount() {

    window.removeEventListener('resize', () => this.onResize());
    document.removeEventListener('keydown', this.onKeyDown);

  }

}
