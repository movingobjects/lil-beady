
// Imports

import * as React from 'react';
import { maths } from 'varyd-utils';

import { generateBlankDesign } from '../utils/utils';

import templates from '../data/templates.json';
import beadsLibrary from '../data/beads-library.json';

// Constants

const BLANK_COLOR = '#eeeeee';


// Class

export default class DesignView extends React.Component {

  // Constructor

  constructor() {

    super();

    this.initState();

  }

  initState() {

    this.state = {
      templateIndex: 0
    }

  }


  // Event handlers

  onKeyDown = (e) => {

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const offset   = (e.key === 'ArrowLeft') ? -1 : 1,
            newIndex = Math.max(0, Math.min(templates.length - 1, this.state.templateIndex + offset));
      this.setState({
        templateIndex: newIndex
      })

    }

  }


  // Methods


  // React

  componentDidMount() {

    document.addEventListener('keydown', this.onKeyDown);

  }
  componentWillUnmount() {

    document.removeEventListener('keydown', this.onKeyDown);

  }


  render() {

    const {
      templateIndex
    } = this.state;

    const template = templates[templateIndex],
          design   = generateBlankDesign(template);

    const areaW   = 700,
          areaH   = 875,
          centerX = areaW / 2,
          topY    = 25,
          colW    = 12,
          rowH    = 10,
          beadW   = 10,
          beadH   = 8;

    const getBeadColor = (id) => {
      return beadsLibrary.some((b) => b.id === id) ? beadsLibrary.find((b) => b.id === id).color : BLANK_COLOR;
    }

    return (
      <section id='design-view'>

        <div className='wrap-design'>
          <svg
            viewBox={`0 0 ${areaW} ${areaH}`}>

            {design.beads.map((bead, i) => {

              return (
                <rect
                  key={`bead-${i}`}
                  x={centerX + (bead.col * colW)}
                  y={topY + (bead.row * rowH)}
                  width={beadW}
                  height={beadH}
                  rx='2'
                  style={{
                    fill: getBeadColor(bead.beadId)
                  }}
                  onMouseOver={() => {
                    //console.log(`${i}: ${bead.beadId} (${bead.col}, ${bead.row})`);
                  }}
                />
              );
            })}

          </svg>

        </div>

      </section>
    )

  }

}
