
import * as React from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { maths, geom } from 'varyd-utils';
import { Stage, Layer, Rect } from 'react-konva';

import * as selectors from 'selectors';

import DragArea from './DragArea';

import layoutOptsData from 'data/layout-opts.json';

class DesignView extends React.Component {

  constructor() {

    super();

    this.state = {
      workingLayout: [ ],
      layoutArea: {
        x: 0,
        y: 0,
        w: 1,
        h: 1
      },
      layoutRects: [ ]
    }

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

    const { workingLayout } = this.state;
    const { bead } = this.props;

    const hit   = [],
          unhit = [];

    // init unhit array with beads _not_ the current draw color
    workingLayout.forEach((item, index) => {
      if (item.beadId !== bead.id) unhit.push(index)
    })

    this.currentDraw = { hit, unhit };

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

    const rectIndex = unhit.find((index) => this.hitRect(x, y, layoutRects[index].hit));

    if (rectIndex === undefined) return;

    unhit.splice(unhit.indexOf(rectIndex), 1);
    hit.push(rectIndex);

    this.setState({
      workingLayout: workingLayout.map((item, index) => {
        if (index === rectIndex) {
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

    const isAHit = layoutRects.some((rect) => this.hitRect(x, y, rect.hit));

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
            layoutRects = this.getLayoutRects(project.layout, layoutArea.w);

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
  getLayoutArea(layout) {

    const opts    = layoutOptsData,
          zoom    = this.props.zoomLevel,
          colW    = zoom * opts.colW,
          rowH    = zoom * opts.rowH;

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

    const w = (maxCol - minCol + 1) * colW,
          h = (maxRow - minRow + 1) * rowH,
          x = (window.innerWidth - w) / 2,
          y = (window.innerHeight - h) / 2;

    return { x, y, w, h };

  }
  getLayoutRects(layout, totalW) {

    const opts = layoutOptsData,
          zoom = this.props.zoomLevel;

    const colW       = zoom * opts.colW,
          rowH       = zoom * opts.rowH,
          beadW      = zoom * opts.beadW,
          beadH      = zoom * opts.beadH,
          beadRadius = zoom * opts.beadRadius;

    const topY    = (rowH / 2),
          centerX = (totalW / 2);

    return layout.map((bead, index) => {

      const hitX = centerX + (bead.col * colW) - (colW / 2),
            hitY = topY + (bead.row * rowH) - (rowH / 2);

      return {
        hit: {
          l: hitX,
          t: hitY,
          r: hitX + colW,
          b: hitY + rowH
        },
        bead: {
          x: centerX + (bead.col * colW) - (beadW / 2),
          y: topY + (bead.row * rowH) - (beadH / 2),
          w: beadW,
          h: beadH,
          r: beadRadius
        }
      };
    });

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

  hitRect(x, y, { l, t, r, b }) {
    return (x >= l) && (y >= t) && (x <= r) && (y <= b);
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

        <Stage
          width={layoutArea.w}
          height={layoutArea.h}>
          <Layer>
            {layoutRects.map((r, i) => (
              <Rect
                key={`bead-${i}`}
                x={r.bead.x}
                y={r.bead.y}
                width={r.bead.w}
                height={r.bead.h}
                cornerRadius={r.bead.r}
                fill={this.getBeadColor(i)} />
            ))}
          </Layer>
        </Stage>

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
