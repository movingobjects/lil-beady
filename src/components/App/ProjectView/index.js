
import * as React from 'react';
import { connect } from 'react-redux';
import { cloneDeep } from 'lodash';
import { maths, geom } from 'varyd-utils';
import { Stage, Layer, Rect } from 'react-konva';
import firebase from 'firebase/app';
import 'firebase/database';
import equal from 'fast-deep-equal';

import { encodeDesign } from '~/utils';
import * as selectors from '~/selectors';

import Palette from './Palette';
import ZoomPanControls from './ZoomPanControls';
import DragArea from '~/components/shared/DragArea';
import IconBtn from '~/components/shared/IconBtn';

import config from '~/config.json';
import styles from './index.module.scss';

class ProjectView extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      designArea: {
        x: 0,
        y: 0,
        w: 1,
        h: 1
      },
      designRects: [ ],
      workingDesign: [ ],
      workingDesignPrev: null,
      hasChanges: false
    }

    this.touchId     = null;
    this.currentDraw = null;

  }

  get project() {

    const {
      projects,
      projectId
    } = this.props;

    return projects.find((p) => p.id === projectId);

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

  onCloseClick = () => {

    if (this.state.hasChanges) {
      this.props.dispatch({
        type: 'confirmAction',
        message: 'You have unsaved changes',
        description: 'By closing this project, you will lose all unsaved changes',
        labelConfirm: `Close project & lose changes`,
        onConfirm: this.onCloseConfirm
      });

    } else {
      this.onCloseConfirm();
    }

  }
  onCloseConfirm = () => {
    window.location.hash = `#/dashboard`;
  }
  onEditClick = () => {
    const {
      projectId
    } = this.props;
    window.location.hash = `#/project/${projectId}/edit`;
  }
  onUndoClick = () => {
    this.setState((state, props) => ({
      hasChanges: !equal(state.workingDesignPrev, this.project?.design),
      workingDesign: state.workingDesignPrev,
      workingDesignPrev: null
    }));
  }
  onSaveClick = () => {
    this.saveDesign();
  }

  onDragStart = ({ x, y }) => {
    this.startDraw();
    this.draw(x, y);
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
    const { beadColor } = this.props;

    const hit   = [],
          unhit = [];

    // init unhit array with beads _not_ the current draw color
    workingDesign.forEach((item, index) => {
      if (item.color !== beadColor) unhit.push(index)
    })

    this.currentDraw = { hit, unhit };

    this.setState({
      workingDesignPrev: cloneDeep(workingDesign)
    })

  }
  draw(x, y) {

    const {
      workingDesign,
      designRects
    } = this.state;

    const {
      beadColor
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
            color: beadColor
          }
        } else {
          return item;
        }
      })
    });

  }
  endDraw() {

    this.setState((state, props) => ({
      hasChanges: !equal(state.workingDesign, this.project?.design)
    }));

    this.currentDraw = null;

  }

  fill(x, y) {

    const {
      designRects
    } = this.state;

    const {
      beadColor
    } = this.props;

    const isAHit = designRects.some((rect) => this.hitRect(x, y, rect.hit));

    if (isAHit) {
      this.setState((state, props) => ({
        hasChanges: !equal(state.workingDesign, this.project?.design),
        workingDesignPrev: cloneDeep(state.workingDesign),
        workingDesign: state.workingDesign.map((item, index) => ({
          ...item,
          color: beadColor
        }))
      }));
    }

  }

  saveDesign() {

    if (!this.project) return;

    const userId    = firebase.auth().currentUser?.uid,
          projectId = this.props.projectId;

    if (userId) {
      firebase.database()
        .ref(`users/${userId}/projects/${projectId}`)
        .update({
          design: encodeDesign(this.state.workingDesign),
          dateLastUpdated: (new Date()).toISOString()
        });

      this.setState({
        hasChanges: false
      });
    }

  }

  resetWorkingDesign() {

    const { design } = this.project || { };

    let workingDesign = design ? cloneDeep(design) : [];

    this.setState({ workingDesign });

  }
  resetView() {

    const { design } = this.project || { };

    if (!design) return;

    const designArea  = this.getDesignArea(design),
          designRects = this.getDesignRects(design, designArea.w);

    this.setState({
      designArea,
      designRects
    });

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
      workingDesign
    } = this.state;

    return workingDesign[index]?.color || config.design.blankColor;

  }

  hitRect(x, y, { l, t, r, b }) {
    return (x >= l) && (y >= t) && (x <= r) && (y <= b);
  }

  componentDidUpdate(prevProps, prevState) {

    const propChanged  = (key) => this.props[key] !== prevProps[key],
          stateChanged = (key) => this.state[key] !== prevState[key];

    const prevProject = prevProps.projects.find((p) => p.id === prevProps.projectId);

    if (!prevProject && this.project) {
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
    this.onResize();

    this.resetWorkingDesign();
    this.resetView();

    this.props.dispatch({
      type: 'resetControls'
    });

  }
  componentWillUnmount() {

    window.removeEventListener('resize', this.onResize);

  }

  render() {

    const {
      designArea,
      designRects,
      hasChanges,
      workingDesignPrev
    } = this.state;

    const canUndo = !!workingDesignPrev;

    return (

      <div className={styles.wrap}>

        <div className={styles.menu}>
          <IconBtn
            icon='arrow-left'
            className={styles.close}
            onClick={this.onCloseClick} />

          <IconBtn
            icon='save'
            className={styles.close}
            disabled={!hasChanges}
            onClick={this.onCloseClick} />

          <IconBtn
            icon='rotate-ccw'
            className={styles.undo}
            disabled={!canUndo}
            onClick={this.onUndoClick} />

        </div>

        <div className={styles.wrapProjectInfo}>
          <IconBtn
            icon='sliders'
            className={styles.edit}
            onClick={this.onEditClick} />
          <h2>{this.project?.name || ''}</h2>

        </div>

        <DragArea
          className={styles.wrapDesign}
          x={designArea.x}
          y={designArea.y}
          w={designArea.w}
          h={designArea.h}
          minDragDist={0}
          onDragStart={this.onDragStart}
          onDrag={this.onDrag}
          onDragEnd={this.onDragEnd}>

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

        <Palette />

        <ZoomPanControls />

      </div>
    );

  }

}

export default connect((state) => ({
  projects: state.projects,
  beads: state.beads,
  beadColor: selectors.getBeadColor(state),
  zoomLevel: selectors.getZoomLevel(state),
  panOffsetX: state.panOffsetX,
  panOffsetY: state.panOffsetY
}))(ProjectView);
