
import * as _ from 'lodash';

export function generateBlankDesign(template, userOpts) {

  const getOpts = (templateOpts, userOpts) => {

    const opts = { };

    templateOpts.forEach((opt) => {
      if (userOpts && userOpts[opt.id]) {
        opts[opt.id] = userOpts[opt.id];
      } else {
        opts[opt.id] = opt.default;
      }
    });

    return opts;

  }

  const getBeads = (opts) => {

    const beads = [];

    _.times(opts.loopRows, (row) => {
      if (row === 0) {
        beads.push(
          { beadId: 'green', col: -1, row: row },
          { beadId: 'green', col:  0, row: row }
        );
      } else {
        beads.push(
          { beadId: 'green', col: -1.5, row: row },
          { beadId: 'green', col:  0.5, row: row }
        );
      }
    });

    if (template.id === 'triangle') {

      _.times(opts.bodyRows, (row) => {
        const cols = opts.bodyTopCols + row,
              rowX = -(cols / 2);
        _.times(opts.bodyRowRepeat, (rowOffset) => {
          const rowY = opts.loopRows + (row * opts.bodyRowRepeat) + rowOffset;
          _.times(cols, (col) => {
            beads.push({
              beadId: null,
              col: rowX + col,
              row: rowY
            })
          })
        });
      });

      const totalCols = opts.bodyTopCols + opts.bodyRows,
            rowX      = -(totalCols / 2);

      _.times(totalCols, (col) => {
        _.times(opts.fringeRows, (row) => {
          const rowY = opts.loopRows + (opts.bodyRows * opts.bodyRowRepeat) + row;
          beads.push({
            beadId: 'blue',
            fCol: col,
            fRow: row,
            col: rowX + col,
            row: rowY
          })
        });
      });

    } else if (template.id === 'square') {

      _.times(opts.bodyRows, (row) => {
        const cols = opts.bodyTopCols,
              rowX = -(cols / 2),
              rowY = opts.loopRows + row;
        _.times(cols, (col) => {
          beads.push({
            beadId: null,
            col: rowX + col,
            row: rowY
          });
        });
      });
      const rowX = -(opts.bodyTopCols / 2);
      _.times(opts.bodyTopCols, (col) => {
        _.times(opts.fringeRows, (row) => {
          const rowY = opts.loopRows + opts.bodyRows + row;
          beads.push({
            beadId: 'blue',
            fCol: col,
            fRow: row,
            col: rowX + col,
            row: rowY
          })
        });
      });

    } else if (template.id === 'diamond') {
      const topRows = Math.ceil(opts.bodyRows / 2),
            btmRows = (opts.bodyTopCols + topRows) - 1;
      _.times(topRows, (row) => {
        const cols = opts.bodyTopCols + row,
              rowX = -(cols / 2);
        _.times(opts.bodyRowRepeat, (rowOffset) => {
          const rowY = opts.loopRows + (row * opts.bodyRowRepeat) + rowOffset;
          _.times(cols, (col) => {
            beads.push({
              beadId: null,
              col: rowX + col,
              row: rowY
            })
          })
        });
      });
      _.times(btmRows, (row) => {
        const cols = (opts.bodyTopCols + topRows) - row,
              rowX = -(cols / 2);
        _.times(opts.bodyRowRepeat, (rowOffset) => {
          const rowY = opts.loopRows + (topRows * opts.bodyRowRepeat) + (row * opts.bodyRowRepeat) + rowOffset;
          _.times(cols, (col) => {
            beads.push({
              beadId: null,
              col: rowX + col,
              row: rowY
            })
          })
        });
      });
      beads.push({
        beadId: null,
        col: -0.5,
        row: opts.loopRows + ((topRows + btmRows) * opts.bodyRowRepeat)
      })

    }

    return beads;

  }

  const getFringeCols = (beads) => {

    const fringeCols = [];

    beads.forEach((bead, index) => {

      const col = bead.fCol,
            row = bead.fRow;

      if (Number.isInteger(col) && Number.isInteger(row)) {
        if (!Array.isArray(fringeCols[col])) {
          fringeCols[col] = [];
        }
        fringeCols[col][row] = index;
      }

    })

    return fringeCols;

  }

  const opts       = getOpts(template.opts, userOpts),
        beads      = getBeads(opts),
        fringeCols = getFringeCols(beads);

  return {
    name: 'Untitled',
    beads,
    fringeCols
  };

}
