
import * as React from 'react';
import { connect } from 'react-redux';

import Beads from './Beads';
import Toolbar from './Toolbar';

class DesignView extends React.Component {

  onBack = () => {

    this.props.dispatch({
      type: 'setMode',
      mode: 'dashboard'
    })

  }

  render() {

    return (
      <section id='design-view'>
        <div
          className='menu'>
          <button
            className='back'
            onClick={this.onBack} />
        </div>
        <Beads />
        <Toolbar />
      </section>
    );

  }

}

export default connect((state) => ({ }))(DesignView);
