
// Imports

import * as React from 'react';
import BeadsView from './BeadsView.react'


// Constants


// Class

export default class App extends React.Component {

  // Constructor

  constructor() {

    super();

    this.initState();

  }

  initState() {

    this.state = { }

  }


  // Event handlers


  // Methods


  // React

  render() {

    return (
      <main>
        <BeadsView />
      </main>
    )

  }

}
