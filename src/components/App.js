
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';

import { getTemplate } from 'selectors';

import DesignView from 'components/DesignView';
import ToolsView from 'components/ToolsView';

import beadsLibrary from 'data/beads-library.json';

class App extends React.Component {

  constructor() {

    super();

    this.initState();

  }

  initState() {

    this.state = {
      beadLibrary: beadsLibrary,
      beadLibraryIndex: 0
    }

  }


  onKeyDown = (e) => {

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {

      const {
        dispatch,
        templates,
        templateIndex
      } = this.props;

      const offset   = (e.key === 'ArrowLeft') ? -1 : 1,
            newIndex = maths.clamp(templateIndex + offset, 0, templates.length - 1);

      dispatch({
        type: 'setTemplateIndex',
        index: newIndex
      });

    }

  }


  onBeadLibraryClick = (beadLibraryIndex) => {

    this.setState({ beadLibraryIndex });

  }


  render() {

    const {
      templates,
      templateIndex
    } = this.props;

    const {
      beadLibrary,
      beadLibraryIndex
    } = this.state;

    const template = templates[templateIndex];

    return (
      <main>

        <ToolsView
          beadLibrary={beadLibrary}
          beadLibraryIndex={beadLibraryIndex}
          onBeadLibraryClick={this.onBeadLibraryClick} />

        <DesignView
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

export default connect((state) => ({
  template: getTemplate(state),
  templates: state.templates,
  templateIndex: state.templateIndex
}))(App);
