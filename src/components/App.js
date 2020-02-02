
import * as React from 'react';
import { connect } from 'react-redux';

import DesignView from 'components/DesignView';
import ToolsView from 'components/ToolsView';

import templates from 'data/templates.json';
import beadsLibrary from 'data/beads-library.json';

class App extends React.Component {

  constructor() {

    super();

    this.initState();

  }

  initState() {

    this.state = {
      beadLibrary: beadsLibrary,
      beadLibraryIndex: 0,
      templateIndex: 0
    }

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


  onBrushSelect = (index) => {

    this.props.dispatch({
      type: 'setBrushIndex',
      index
    })

  }
  onBeadLibraryClick = (beadLibraryIndex) => {

    this.setState({ beadLibraryIndex });

  }


  render() {

    const {
      beadLibrary,
      beadLibraryIndex
    } = this.state;

    const template = templates[this.state.templateIndex];

    return (
      <main>

        <ToolsView
          beadLibrary={beadLibrary}
          beadLibraryIndex={beadLibraryIndex}
          onBrushSelect={this.onBrushSelect}
          onBeadLibraryClick={this.onBeadLibraryClick} />

        <DesignView
          template={template}
          bead={beadLibrary[beadLibraryIndex]} />

      </main>
    )

  }

  componentDidMount() {

    document.addEventListener('keydown', this.onKeyDown);

  }
  componentWillUnmount() {

    document.removeEventListener('keydown', this.onKeyDown);

  }

}

export default connect((state) => ({ }))(App);
