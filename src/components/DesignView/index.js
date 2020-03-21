
import * as React from 'react';
import { connect } from 'react-redux';

import Beads from './Beads';
import Toolbar from './Toolbar';

class DesignView extends React.Component {

  render() {

    return (
      <section id='design-view'>
        <Beads />
        <Toolbar />
      </section>
    );

  }

}

export default connect((state) => ({ }))(DesignView);
