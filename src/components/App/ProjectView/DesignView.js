
import * as React from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import {
  maths,
  geom
} from 'varyd-utils';

import { getBead } from 'selectors';

import DragArea from './DragArea';

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
      workingLayout: null,
      layoutArea: { x: 0, y: 0, w: 1, h: 1},
      layoutRects: [ ]
    }

    this.svgRef  = React.createRef();

    this.touchId     = null;
    this.currentDraw = null;

  }

  onResize = (e) => {

    const {
      layoutArea
    } = this.state;

    this.setState({
      layoutArea: {
        ...layoutArea,
        x: (window.innerWidth - layoutArea.w) / 2,
        y: (window.innerHeight - layoutArea.h) / 2
      }
    })

  }

  onDragStart = (x, y) => {

    const {
      layoutRects
    } = this.state;

    this.currentDraw = {
      hit: [],
      unhit: [ ...Array(layoutRects.length).keys() ]
    };

    this.onDrag(x, y);

  }
  onDrag = (x, y) => {

    if (this.currentDraw) {
      this.draw(x, y);
    }

  }
  onDragEnd = (x, y) => {

    this.currentDraw = null;

  }

  draw(x, y) {

    const {
      workingLayout,
      layoutRects
    } = this.state;

    const {
      bead
    } = this.props;

    const {
      hit,
      unhit
    } = this.currentDraw;

    const hitIndex = unhit.find((rectIndex) => {
      const rect = layoutRects[rectIndex].hit;
      return (
        (x > rect.x) &&
        (y > rect.y) &&
        (x < rect.x + rect.w) &&
        (y < rect.y + rect.h)
      )
    });

    if (hitIndex === -1) return;

    this.currentDraw = {
      hit: [
        ...hit,
        hitIndex
      ],
      unhit: unhit.filter((index) => index !== hitIndex)
    };

    this.setState({
      workingLayout: workingLayout.map((item, index) => {
        if (index === hitIndex) {
          return {
            ...item,
            beadId: bead.id
          }
        } else {
          return item;
        }
      })
    });

  }
  save() {

    const {
      dispatch,
      projects,
      projectId
    } = this.props;

    const project = projects.find((p) => p.id === projectId);

    if (!project) return;

    dispatch({
      type: 'updateProject',
      projectId,
      project: {
        ...project,
        layout: cloneDeep(this.state.workingLayout)
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

    const workingLayout = cloneDeep(project.layout),
          layoutArea    = this.getLayoutArea(project.layout),
          layoutRects   = this.getLayoutRects(project.layout, layoutArea);

    this.setState({
      workingLayout,
      layoutArea,
      layoutRects
    });

  }
  getLayoutArea(layout) {

    const {
      padding,
      colW,
      rowH
    } = LAYOUT_OPTS;

    let minCol = NaN,
        maxCol = NaN,
        minRow = NaN,
        maxRow = NaN;

    layout.forEach((bead) => {
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
  getLayoutRects(layout, layoutArea) {

    const {
      padding,
      colW,
      rowH,
      beadW,
      beadH
    } = LAYOUT_OPTS;

    const topY    = padding,
          centerX = (layoutArea.w / 2);

    return layout.map((bead, index) => ({
      hit: {
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

  getBeadColor(index) {

    const {
      beads
    } = this.props;

    const {
      workingLayout
    } = this.state;

    const item   = workingLayout[index];

    return beads.find((b) => b.id === item.beadId)?.color || BLANK_COLOR;

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
      layoutArea,
      layoutRects
    } = this.state;

    return (
      <DragArea
        className='wrap-beads'
        x={layoutArea.x}
        y={layoutArea.y}
        w={layoutArea.w}
        h={layoutArea.h}
        onDragStart={this.onDragStart}
        onDrag={this.onDrag}
        onDragEnd={this.onDragEnd}>

        <svg
          ref={this.svgRef}
          viewBox={`0 0 ${layoutArea.w} ${layoutArea.h}`}
          style={{
            width: layoutArea.w,
            height: layoutArea.h
          }}>

          {layoutRects.map((r, i) => (
            <rect
              key={`bead-${i}`}
              x={r.bead.x}
              y={r.bead.y}
              width={r.bead.w}
              height={r.bead.h}
              rx='2'
              style={{
                fill: this.getBeadColor(i)
              }}
            />
          ))}

        </svg>

      </DragArea>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  toolIndex: state.toolIndex,
  bead: getBead(state),
  beads: state.beads
}))(DesignView);
