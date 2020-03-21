
import * as React from 'react';
import { connect } from 'react-redux';
import { maths } from 'varyd-utils';

import { generateBlankDesign } from 'utils/utils';
import DesignView from 'components/DesignView';

class App extends React.Component {

  constructor(props) {

    super();

    props.dispatch({
      type: 'setDesign',
      design: generateBlankDesign(props.templates[0])
    });

  }

  render() {

    return (
      <main>
        <DesignView />
      </main>
    )

  }

}

export default connect((state) => ({
  templates: state.templates
}))(App);
