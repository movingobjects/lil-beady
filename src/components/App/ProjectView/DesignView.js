
import * as React from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
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

class DesignView extends React.Component {

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
      const brush = brushesData[this.props.brushIndex];
      this.draw(x, y, brush);
    }

  }
  onDragEnd = (x, y) => {

    this.currentDraw = null;

  }

  draw(x, y, brush) {

    const {
      hit,
      unhit
    } = this.currentDraw;

    const {
      rects
    } = this.state;

    const isHit = (index) => {

      const rect = rects[index].area;

      if (x < rect.x) return false;
      if (y < rect.y) return false;
      if (x > rect.x + rect.w) return false;
      if (y > rect.y + rect.h) return false;

      return true;

    }

    const center = unhit.find((index) => isHit(index));

    if (!center) return;

    this.currentDraw = {
      hit: [
        ...hit,
        center
      ],
      unhit: unhit.filter((index) => index !== center)
    };

    this.applyDraw([ center ]);

  }

  applyDraw(rectIndexes) {

    const {
      bead
    } = this.props;

    const {
      rects
    } = this.state;

    const newRects = cloneDeep(rects);

    rectIndexes.forEach((index) => {
      newRects[index] = {
        ...newRects[index],
        beadId: bead.id
      }
    })

    this.setState({
      rects: newRects
    });

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

  save() {

    const {
      dispatch,
      projects,
      projectId
    } = this.props;

    const {
      rects
    } = this.state;

    const project = projects.find((p) => p.id === projectId);

    if (!project) return;

    const layout = cloneDeep(project.layout);

    // TODO save layout here!

    dispatch({
      type: 'updateProject',
      projectId,
      project: {
        ...project,
        layout
      }
    });

  }

  setupProject() {

    const {
      projects,
      projectId
    } = this.props;

    const project = projects.find((p) => p.id === projectId);

    if (!project) return;
    if (!project.layout) return;

    const area    = this.getLayoutArea(project.layout),
          rects   = this.getLayoutRects(project.layout, area);

    this.setState({ area, rects });

  }

  getLayoutArea(beads) {

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
  getLayoutRects(beads, rect) {

    const {
      padding,
      colW,
      rowH,
      beadW,
      beadH
    } = LAYOUT_OPTS;

    const topY    = padding,
          centerX = (rect.w / 2);

    return beads.map((bead, index) => ({
      index: index,
      beadId: bead.beadId,
      area: {
        x: centerX + (bead.col * colW) - (colW / 2),
        y: topY + (bead.row * rowH) - (rowH / 2),
        w: colW,
        h: rowH
      },
      bead: {
        x: centerX + (bead.col * colW) - (beadW / 2),
        y: topY + (bead.row * rowH) - (beadH / 2),
        w: beadW,
        h: beadH,
      }
    }));

  }
  getBeadColor(beadId) {
    const beads = this.props.beads,
          bead  = beads.find((b) => b.id === beadId);
    return bead ? bead.color : BLANK_COLOR;
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

    this.setupProject();

  }
  componentWillUnmount() {

    window.removeEventListener('resize', this.onResize);

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
          viewBox={`0 0 ${area.w} ${area.h}`}
          style={{
            width: area.w,
            height: area.h
          }}>

          {rects.map((r, i) => (
            <rect
              key={`bead-${i}`}
              x={r.bead.x}
              y={r.bead.y}
              width={r.bead.w}
              height={r.bead.h}
              rx='2'
              style={{
                fill: this.getBeadColor(r.beadId)
              }}
            />
          ))}

        </svg>

      </div>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  brushIndex: state.brushIndex,
  bead: getBead(state),
  beads: state.beads
}))(DesignView);
