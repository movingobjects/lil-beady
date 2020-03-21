
import * as React from 'react';
import { connect } from 'react-redux';
import {
  maths,
  geom
} from 'varyd-utils';

import { getBead } from 'selectors';
import brushesData from 'data/brushes.json';

const BLANK_COLOR = '#eeeeee';

const LAYOUT_OPTS = {
  padding: 25,
  colW: 12,
  rowH: 10,
  beadW: 10,
  beadH: 8
};

class Beads extends React.Component {

  constructor() {

    super();

    this.state = {
      area: { x: 0, y: 0, w: 1, h: 1},
      rects: []
    }

    this.svgRef  = React.createRef();

    this.touchId     = null;
    this.currentDraw = null;

  }


  onResize = (e) => {

    const {
      area
    } = this.state;

    this.setState({
      area: {
        ...area,
        x: (window.innerWidth - area.w) / 2,
        y: (window.innerHeight - area.h) / 2
      }
    })

  }

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

    const count = this.state.rects.length;

    this.currentDraw = {
      hit: [],
      unhit: [ ...Array(count).keys() ]
    };

    this.onDrag(x, y);

  }
  onDrag = (x, y) => {

    if (this.currentDraw) {

      const brush  = brushesData[this.props.brushIndex],
            distSq = brush.dist * brush.dist;

      this.draw(x, y, distSq, brush.maxCount);

    }

  }
  onDragEnd = (x, y) => {

    this.currentDraw = null;

  }


  draw(x, y, minDistSq, maxCount) {

    const {
      hit,
      unhit
    } = this.currentDraw;

    const {
      rects
    } = this.state;

    const {
      dispatch,
      bead
    } = this.props;

    const newHits = unhit.filter((index) => {
      const rect   = rects[index],
            rectX  = rect.x + (rect.w * 0.5),
            rectY  = rect.y + (rect.h * 0.5),
            distSq = geom.distSqXY(rectX, rectY, x, y);
      return (distSq < minDistSq);
    });

    if (newHits.length) {

      this.currentDraw = {
        hit: [
          ...hit,
          newHits
        ],
        unhit: unhit.filter((index) => !newHits.includes(index))
      };

      dispatch({
        type: 'updateBeads',
        beads: newHits,
        beadId: bead.id
      });

    }

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

  updateDesign() {

    const design = this.props.design,
          area   = this.getBeadsArea(design.beads),
          rects  = this.getBeadRects(design.beads, area);

    this.setState({ area, rects });

  }


  getBeadsArea(beads) {

    const {
      padding,
      colW,
      rowH
    } = LAYOUT_OPTS;

    let minCol = NaN,
        maxCol = NaN,
        minRow = NaN,
        maxRow = NaN;

    beads.forEach((bead) => {
      if (isNaN(minCol) || bead.col < minCol) minCol = bead.col;
      if (isNaN(maxCol) || bead.col > maxCol) maxCol = bead.col;
      if (isNaN(minRow) || bead.row < minRow) minRow = bead.row;
      if (isNaN(maxRow) || bead.row > maxRow) maxRow = bead.row;
    });

    const w = (padding * 2) + ((maxCol - minCol) * colW),
          h = (padding * 2) + ((maxRow - minRow) * rowH),
          x = (window.innerWidth - w) / 2,
          y = (window.innerHeight - h) / 2;

    return { x, y, w, h };

  }
  getBeadRects(beads, rect) {

    const {
      padding,
      colW,
      rowH,
      beadW,
      beadH
    } = LAYOUT_OPTS;

    const getBeadColor = (id) => {
      const beads = this.props.beads,
            bead  = beads.find((b) => b.id === id);
      return bead ? bead.color : BLANK_COLOR;
    }

    const topY    = padding,
          centerX = (rect.w / 2);

    return beads.map((bead, index) => ({
      index: index,
      x: centerX + (bead.col * colW) - (beadW / 2),
      y: topY + (bead.row * rowH) - (beadH / 2),
      w: beadW,
      h: beadH,
      color: getBeadColor(bead.beadId)
    }));

  }

  toSvgPt(clientX, clientY) {

    const svgRect = this.svgRef.current.getBoundingClientRect();

    return {
      x: clientX - svgRect.x,
      y: clientY - svgRect.y
    };

  }


  componentDidMount() {

    window.addEventListener('resize', this.onResize);

    this.updateDesign();

  }
  componentWillUnmount() {

    window.removeEventListener('resize', this.onResize);

  }

  componentDidUpdate(prevProps, prevState) {

    const propChanged = (val) => this.props[val] !== prevProps[val];

    if (propChanged('design')) {
      this.updateDesign();
    }

  }

  render() {

    const {
      area,
      rects
    } = this.state;

    return (
      <div
        className='wrap-beads'
        style={{
          left: area.x,
          top: area.y,
          width: area.w,
          height: area.h
        }}
        onMouseDown={this.onMouseStart}
        onTouchStart={this.onTouchStart}>

        <svg
          ref={this.svgRef}
          className='rs-view'
          viewBox={`0 0 ${area.w} ${area.h}`}
          style={{
            width: area.w,
            height: area.h
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

export default connect((state) => ({
  design: state.design,
  brushIndex: state.brushIndex,
  bead: getBead(state),
  beads: state.beads
}))(Beads);