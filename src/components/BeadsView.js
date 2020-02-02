
// Imports

import * as React from 'react';
import { maths, geom } from 'varyd-utils';

// Constants

// Class

export default class BeadsView extends React.Component {

  // Constructor

  constructor() {

    super();

    this.svgRef   = React.createRef();

    this.touchId  = null;
    this.drawing = false;

  }

  toSvgPt(clientX, clientY) {

    const svgRect = this.svgRef.current.getBoundingClientRect();

    return {
      x: clientX - svgRect.x,
      y: clientY - svgRect.y
    };

  }


  // Event handlers

  onMouseStart = (e) => {

    this.touchId = 0;

    const pt = this.toSvgPt(e.clientX, e.clientY);
    this.onDragStart(pt.x, pt.y);

    this.startMouseEvents();


  }
  onMouseMove = (e) => {

    if (this.touchId !== null) {
      const pt = this.toSvgPt(e.clientX, e.clientY);
      this.onDrag(pt.x, pt.y);
    }

  }
  onMouseEnd = (e) => {

    this.endMouseEvents();

    const pt = this.toSvgPt(e.clientX, e.clientY);
    this.onDragEnd(pt.x, pt.y);

    this.touchId = null;

  }

  onTouchStart = (e) => {

    this.startTouchEvents();

    const touch = e.changedTouches[0],
          pt    = this.toSvgPt(touch.clientX, touch.clientY);

    this.touchId = touch.identifier;

    this.onDragStart(pt.x, pt.y);

  }
  onTouchMove = (e) => {

    if (this.touchId !== null) {

      const touch = e.changedTouches[0],
            pt    = this.toSvgPt(touch.clientX, touch.clientY);

      this.onDrag(pt.x, pt.y);

    }

  }
  onTouchEnd = (e) => {

    this.endTouchEvents();

    const touch = e.changedTouches[0],
    pt    = this.toSvgPt(touch.clientX, touch.clientY);

    this.onDragEnd(pt.x, pt.y);

    this.touchId = null;

  }

  onDragStart = (x, y) => {

    this.drawing = true;

    this.onDrag(x, y);

  }
  onDrag = (x, y) => {

    if (this.drawing) {

      const brushDist = (this.props.tool === 'draw') ? 25 : 50,
            maxCount  = (this.props.tool === 'draw') ? 1 : undefined;

      const beads = this.getBeadsNear(x, y, brushDist, maxCount);

      if (beads.length) {
        this.props.onDraw(beads);
      }

    }

  }
  onDragEnd = (x, y) => {

    this.drawing = false;

  }


  // Methods

  getBeadsNear(x, y, dist, maxCount) {

    const minDistSq = dist * dist;

    let beads = [];

    this.props.rects.forEach((rect, index) => {

      const beadX  = rect.x + (rect.w * 0.5),
            beadY  = rect.y + (rect.h * 0.5),
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

  startMouseEvents() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseEnd);
  }
  endMouseEvents() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseEnd);
  }

  startTouchEvents() {
    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onTouchEnd);
  }
  endTouchEvents() {
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
  }



  // React

  render() {

    const {
      areaW,
      areaH,
      rects
    } = this.props;

    return (
      <div
        className='wrap-beads'
        style={{
          width: areaW,
          height: areaH
        }}
        onMouseDown={this.onMouseStart}
        onTouchStart={this.onTouchStart}>

        <svg
          ref={this.svgRef}
          className='rs-view'
          viewBox={`0 0 ${areaW} ${areaH}`}
          style={{
            width: areaW,
            height: areaH
          }}>

          {rects.map((r, i) => (
            <rect
              key={`bead-${i}`}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx='2'
              style={{
                fill: r.color
              }}
            />
          ))}

        </svg>

      </div>
    );

  }

}
