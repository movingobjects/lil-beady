
import * as React from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { maths, geom } from 'varyd-utils';

import * as selectors from 'selectors';

import DragArea from './DragArea';

import layoutOptsData from 'data/layout-opts.json';

class DesignView extends React.Component {

  constructor() {

    super();

    this.state = {
      workingLayout: [ ],
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
    });

  }

  onDragStart = (x, y) => {

    const {
      tool
    } = this.props;

    if (tool.id === 'fill') {
      this.fill(x, y);
      return;

    } else if (tool.id === 'draw') {
      this.startDraw();
      this.draw(x, y);
    }

  }
  onDrag = (x, y) => {

    if (this.currentDraw) {
      this.draw(x, y);
    }

  }
  onDragEnd = (x, y) => {

    if (this.currentDraw) {
      this.endDraw();
    }

  }

  startDraw() {

    const {
      layoutRects
    } = this.state;

    this.currentDraw = {
      hit: [],
      unhit: [ ...Array(layoutRects.length).keys() ]
    };

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
  endDraw() {
    this.currentDraw = null;
  }

  fill(x, y) {

    const {
      workingLayout,
      layoutRects
    } = this.state;

    const {
      bead
    } = this.props;

    const isAHit = !!layoutRects.find(({ hit }) => (
      (x > hit.x) &&
      (y > hit.y) &&
      (x < hit.x + hit.w) &&
      (y < hit.y + hit.h)
    ))

    if (isAHit) {
      this.setState({
        workingLayout: workingLayout.map((item, index) => ({
          ...item,
          beadId: bead.id
        }))
      });
    }

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

  resetWorkingLayout() {

    const project       = this.getProject(),
          workingLayout = project ? cloneDeep(project.layout) : [];

    this.setState({ workingLayout });

  }
  resetView() {

    const project = this.getProject();

    if (project?.layout) {

      const layoutArea  = this.getLayoutArea(project.layout),
            layoutRects = this.getLayoutRects(project.layout, layoutArea);

      this.setState({
        layoutArea,
        layoutRects
      });

    }

  }

  getProject() {

    const {
      projects,
      projectId
    } = this.props;

    return projects.find((p) => p.id === projectId);

  }
  getLayoutOpts() {

    const {
      zoomLevel
    } = this.props;

    const data = layoutOptsData;

    return {
      ...data,
      padding: zoomLevel * data.padding,
      colW: zoomLevel * data.colW,
      rowH: zoomLevel * data.rowH,
      beadW: zoomLevel * data.beadW,
      beadH: zoomLevel * data.beadH,
      cornerRadius: zoomLevel * data.cornerRadius
    }

  }
  getLayoutArea(layout) {

    const {
      padding,
      colW,
      rowH
    } = this.getLayoutOpts();

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
    } = this.getLayoutOpts();

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

    return beads.find((b) => b.id === item.beadId)?.color || layoutOptsData.blankColor;

  }

  componentDidUpdate(prevProps, prevState) {

    const propChanged  = (key) => this.props[key] !== prevProps[key],
          stateChanged = (key) => this.state[key] !== prevState[key];

    if (propChanged('zoomLevel')) {
      this.resetView();
    }

  }

  componentDidMount() {

    window.addEventListener('resize', this.onResize);

    this.resetWorkingLayout();
    this.resetView();

  }
  componentWillUnmount() {

    window.removeEventListener('resize', this.onResize);

  }

  render() {

    const {
      cornerRadius
    } = this.getLayoutOpts();

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
              rx={cornerRadius}
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
  tool: selectors.getTool(state),
  bead: selectors.getBead(state),
  beads: state.beads,
  zoomLevel: selectors.getZoomLevel(state)
}))(DesignView);
