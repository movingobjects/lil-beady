
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';

import { getTemplate } from 'selectors';

import DesignView from 'components/DesignView';
import ToolsView from 'components/ToolsView';

class App extends React.Component {

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

  render() {

    return (
      <main>
        <ToolsView />
        <DesignView />
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
