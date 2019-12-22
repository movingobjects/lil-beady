
// Imports

import * as React from 'react';
import { maths, geom } from 'varyd-utils';

import { generateBlankDesign } from '../utils/utils';

import templates from '../data/templates.json';
import beadsLibrary from '../data/beads-library.json';

// Constants

const BLANK_COLOR = '#eeeeee';

const LAYOUT_OPTS = {
  areaW: 700,
  areaH: 800,
  topY: 25,
  colW: 12,
  rowH: 10,
  beadW: 10,
  beadH: 8
};


// Class

export default class DesignView extends React.Component {

  // Constructor

  constructor() {

    super();

    this.initState();

  }

  initState() {

    const template = templates[0],
          design   = generateBlankDesign(template);

    this.state = {
      design: design,
      beadsLayout: this.getBeadsLayout(design.beads),
      drawing: false
    }

    this.designRef = React.createRef();

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

  onMouseStart = (e) => {

    this.setState({
      drawing: true
    })

  }
  onMouseMove = (e) => {

    if (this.state.drawing) {

      const x         = e.clientX,
            y         = e.clientY,
            brushDist = (this.props.tool === 'draw') ? 25 : 50,
            maxCount  = (this.props.tool === 'draw') ? 1 : undefined;

      const beads = this.getBeadsNear(x, y, brushDist, maxCount);

      if (beads.length) {

        const designUpdate = { ... this.state.design };

        beads.forEach((index) => {
          designUpdate.beads[index].beadId = this.props.bead.id;
        })

        this.setState({
          design: designUpdate
        })

      }

    }

  }
  onMouseEnd = (e) => {

    this.setState({
      drawing: false
    })

  }

  onTouchStart = (e) => {

    const touch = e.changedTouches[0];

    this.setState({
      drawing: true,
      touchId: touch.identifier
    });

  }
  onTouchMove = (e) => {

    const {
      drawing,
      touchId,
      design
    } = this.state;

    const touch = e.changedTouches[0];

    if (drawing && touchId === touch.identifier) {

      const x         = touch.clientX,
            y         = touch.clientY,
            brushDist = (this.props.tool === 'draw') ? 25 : 50,
            maxCount  = (this.props.tool === 'draw') ? 1 : undefined;

      const beads = this.getBeadsNear(x, y, brushDist, maxCount);

      if (beads.length) {

        const designUpdate = { ... design };

        beads.forEach((index) => {
          designUpdate.beads[index].beadId = this.props.bead.id;
        })

        this.setState({
          design: designUpdate
        })

      }

    }

  }
  onTouchEnd = (e) => {

    this.setState({
      drawing: false,
      touchId: null
    })

  }

  // Methods

  getBeadsLayout(beads) {

    const {
      areaW,
      areaH,
      topY,
      colW,
      rowH
    } = LAYOUT_OPTS;

    const centerX = (areaW / 2);

    return beads.map((bead, index) => ({
      index: index,
      x: centerX + (bead.col * colW),
      y: topY + (bead.row * rowH)
    }));

  }

  getBeadsNear(x, y, dist, maxCount) {

    const designRect = this.designRef.current.getBoundingClientRect(),
          designX    = designRect.x,
          designY    = designRect.y;

    const minDistSq = dist * dist;

    let beads = [];

    this.state.beadsLayout.forEach((beadPos, index) => {

      const beadX  = designX + beadPos.x,
            beadY  = designY + beadPos.y,
            distSq = geom.distSqXY(x, y, beadX, beadY);

      if (distSq < minDistSq) {
        beads.push({
          index,
          distSq
        });
      }

    });

    if (maxCount !== undefined) {
      beads.sort((a, b) => a.distSq - b.distSq);
      beads = beads.slice(0, maxCount);
    }

    return beads.map((b) => b.index);

  }


  // React

  componentDidMount() {

    document.addEventListener('keydown', this.onKeyDown);

  }
  componentWillUnmount() {

    document.removeEventListener('keydown', this.onKeyDown);

  }

  render() {

    const {
      design
    } = this.state;

    const {
      areaW,
      areaH,
      beadW,
      beadH
    } = LAYOUT_OPTS;

    const getBeadColor = (id) => {
      return beadsLibrary.some((b) => b.id === id) ? beadsLibrary.find((b) => b.id === id).color : BLANK_COLOR;
    }

    return (
      <section id='design-view'>

        <div
          className='wrap-design'
          style={{
            width: areaW,
            height: areaH
          }}>

          <svg
            ref={this.designRef}
            viewBox={`0 0 ${areaW} ${areaH}`}
            style={{
              width: areaW,
              height: areaH
            }}
            onMouseDown={this.onMouseStart}
            onMouseMove={this.onMouseMove}
            onMouseUp={this.onMouseEnd}
            onTouchStart={this.onTouchStart}
            onTouchMove={this.onTouchMove}
            onTouchEnd={this.onTouchEnd} >

            {this.state.beadsLayout.map((beadPos, i) => {

              const bead = design.beads[beadPos.index];

              return (
                <rect
                  key={`bead-${i}`}
                  x={beadPos.x - (LAYOUT_OPTS.beadW / 2)}
                  y={beadPos.y - (LAYOUT_OPTS.beadH / 2)}
                  width={LAYOUT_OPTS.beadW}
                  height={LAYOUT_OPTS.beadH}
                  rx='2'
                  style={{
                    fill: getBeadColor(bead.beadId)
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
