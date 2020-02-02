
import * as React from 'react';
import { connect } from 'react-redux';

import { getTemplate } from 'selectors';

import { maths, geom } from 'varyd-utils';
import BeadsView from 'components/BeadsView';

import { generateBlankDesign } from 'utils/utils';

import beadsLibrary from 'data/beads-library.json';

const BLANK_COLOR = '#eeeeee';

const LAYOUT_OPTS = {
  padding: 25,
  colW: 12,
  rowH: 10,
  beadW: 10,
  beadH: 8
};

class DesignView extends React.Component {

  constructor(props) {

    super();

    this.state = {
      drawing: false,
      zoom: 1,
      design: generateBlankDesign(props.template)
    }

  }


  onDraw = (beads) => {

    const designUpdate = {
      ...this.state.design
    };

    beads.forEach((index) => {
      designUpdate.beads[index].beadId = this.props.bead.id;
    })

    this.setState({
      design: designUpdate
    })

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

    const cols = maxCol - minCol,
          rows = maxRow - minRow;

    return {
      w: (padding * 2) + (cols * colW),
      h: (padding * 2) + (rows * rowH)
    };

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
      return beadsLibrary.some((b) => b.id === id) ? beadsLibrary.find((b) => b.id === id).color : BLANK_COLOR;
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


  componentDidUpdate(prevProps, prevState) {

    if (prevProps.template !== this.props.template) {

      this.setState({
        design: generateBlankDesign(this.props.template)
      });

    }

  }

  render() {

    const {
      design
    } = this.state;

    const beadsArea = this.getBeadsArea(design.beads),
          beadRects = this.getBeadRects(design.beads, beadsArea);

    return (
      <section id='design-view'>

        <BeadsView
          areaW={beadsArea.w}
          areaH={beadsArea.h}
          rects={beadRects}
          tool={this.props.tool}
          onDraw={this.onDraw} />

      </section>
    )

  }

}

export default connect((state) => ({
  template: getTemplate(state)
}))(DesignView);
