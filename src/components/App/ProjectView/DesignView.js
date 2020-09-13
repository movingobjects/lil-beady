
import * as React from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { maths, geom } from 'varyd-utils';
import { Stage, Layer, Rect } from 'react-konva';

import firebase from 'firebase/app';
import 'firebase/database';

import { encodeDesign } from '~/utils';

import * as selectors from '~/selectors';

import DragArea from '~/components/shared/DragArea';

import config from '~/config.json';

class DesignView extends React.Component {

  constructor() {

    super();

    this.state = {
      workingDesign: [ ],
      designArea: {
        x: 0,
        y: 0,
        w: 1,
        h: 1
      },
      designRects: [ ],
      isChanged: true
    }

    this.touchId     = null;
    this.currentDraw = null;

  }

  onResize = (e) => {

    const {
      designArea
    } = this.state;

    this.setState({
      designArea: {
        ...designArea,
        x: (window.innerWidth - designArea.w) / 2,
        y: (window.innerHeight - designArea.h) / 2
      }
    });

  }

  onDragStart = ({ x, y }) => {

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
  onDrag = ({ x, y }) => {

    if (this.currentDraw) {
      this.draw(x, y);
    }

  }
  onDragEnd = ({ x, y }) => {

    if (this.currentDraw) {
      this.endDraw();
    }

  }

  startDraw() {

    const { workingDesign } = this.state;
    const { bead, beadId } = this.props;

    const hit   = [],
          unhit = [];

    // init unhit array with beads _not_ the current draw color
    workingDesign.forEach((item, index) => {
      if (item.beadId !== beadId) unhit.push(index)
    })

    this.currentDraw = { hit, unhit };

    this.setState({
      isChanged: true
    })

  }
  draw(x, y) {

    const {
      workingDesign,
      designRects
    } = this.state;

    const {
      beadId
    } = this.props;

    const {
      hit,
      unhit
    } = this.currentDraw;

    const rectIndex = unhit.find((index) => this.hitRect(x, y, designRects[index].hit));

    if (rectIndex === undefined) return;

    unhit.splice(unhit.indexOf(rectIndex), 1);
    hit.push(rectIndex);

    this.setState({
      workingDesign: workingDesign.map((item, index) => {
        if (index === rectIndex) {
          return {
            ...item,
            beadId
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
      workingDesign,
      designRects
    } = this.state;

    const {
      beadId
    } = this.props;

    const isAHit = designRects.some((rect) => this.hitRect(x, y, rect.hit));

    if (isAHit) {
      this.setState({
        workingDesign: workingDesign.map((item, index) => ({
          ...item,
          beadId
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

    const project = projects[projectId];

    if (!project) return;

    firebase.database()
      .ref(`projects/${projectId}`)
      .set({
        ...project,
        design: encodeDesign(this.state.workingDesign)
      });

    this.setState({
      isChanged: false
    })

  }

  resetWorkingDesign() {

    const {
      projects,
      projectId
    } = this.props;

    const project       = projects[projectId],
          workingDesign = project ? cloneDeep(project.design) : [];

    this.setState({ workingDesign });

  }
  resetView() {

    const {
      projects,
      projectId
    } = this.props;

    const project = projects[projectId];

    if (project?.design) {

      const designArea  = this.getDesignArea(project.design),
            designRects = this.getDesignRects(project.design, designArea.w);

      this.setState({
        designArea,
        designRects
      });

    }

  }
  getDesignArea(design) {

    const {
      zoomLevel,
      panOffsetX,
      panOffsetY
    } = this.props;

    const opts = config.design,
          colW = zoomLevel * opts.colW,
          rowH = zoomLevel * opts.rowH;

    let minCol = NaN,
        maxCol = NaN,
        minRow = NaN,
        maxRow = NaN;

    design.forEach((bead) => {
      if (isNaN(minCol) || bead.col < minCol) minCol = bead.col;
      if (isNaN(maxCol) || bead.col > maxCol) maxCol = bead.col;
      if (isNaN(minRow) || bead.row < minRow) minRow = bead.row;
      if (isNaN(maxRow) || bead.row > maxRow) maxRow = bead.row;
    });

    const offsetX = panOffsetX * config.controls.panDist * zoomLevel,
          offsetY = panOffsetY * config.controls.panDist * zoomLevel;

    const w = (maxCol - minCol + 1) * colW,
          h = (maxRow - minRow + 1) * rowH,
          x = offsetX + (window.innerWidth - w) / 2,
          y = offsetY + (window.innerHeight - h) / 2;

    return { x, y, w, h };

  }
  getDesignRects(design, totalW) {

    const opts = config.design,
          zoom = this.props.zoomLevel;

    const colW       = zoom * opts.colW,
          rowH       = zoom * opts.rowH,
          beadW      = zoom * opts.beadW,
          beadH      = zoom * opts.beadH,
          beadRadius = zoom * opts.beadRadius;

    const topY    = (rowH / 2),
          centerX = (totalW / 2);

    return design.map((bead, index) => {

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
      workingDesign
    } = this.state;

    const item   = workingDesign[index];

    return beads[item.beadId]?.color || config.design.blankColor;

  }

  hitRect(x, y, { l, t, r, b }) {
    return (x >= l) && (y >= t) && (x <= r) && (y <= b);
  }

  componentDidUpdate(prevProps, prevState) {

    const propChanged  = (key) => this.props[key] !== prevProps[key],
          stateChanged = (key) => this.state[key] !== prevState[key];

    const prevProject = prevProps.projects[prevProps.projectId],
          project     = this.props.projects[this.props.projectId];

    if (!prevProject && project) {
      this.resetWorkingDesign();
      this.resetView();
    }

    if (propChanged('zoomLevel')) {
      this.resetView();
    }

    if (propChanged('panOffsetX') || propChanged('panOffsetY')) {
      this.resetView();
    }

  }

  componentDidMount() {

    window.addEventListener('resize', this.onResize);

    this.resetWorkingDesign();
    this.resetView();

  }
  componentWillUnmount() {

    window.removeEventListener('resize', this.onResize);

  }

  render() {

    const {
      designArea,
      designRects,
      isChanged
    } = this.state;

    return (
      <DragArea
        className='wrap-beads'
        x={designArea.x}
        y={designArea.y}
        w={designArea.w}
        h={designArea.h}
        minDragDist={0}
        onDragStart={this.onDragStart}
        onDrag={this.onDrag}
        onDragEnd={this.onDragEnd}>

        <button
          className='save'
          disabled={!isChanged}
          onClick={() => this.save()}>
          Save
        </button>

        <Stage
          width={designArea.w}
          height={designArea.h}>
          <Layer>
            {designRects.map((r, i) => (
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
  beadId: state.beadId,
  zoomLevel: selectors.getZoomLevel(state),
  panOffsetX: state.panOffsetX,
  panOffsetY: state.panOffsetY
}))(DesignView);
