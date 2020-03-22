
import { times } from 'lodash';

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

    times(opts.loopRows, (row) => {
      if (row === 0) {
        beads.push(
          { beadId: null, col: -0.5, row: row },
          { beadId: null, col:  0.5, row: row }
        );
      } else {
        beads.push(
          { beadId: null, col: -1, row: row },
          { beadId: null, col:  1, row: row }
        );
      }
    });

    if (template.id === 'triangle') {

      times(opts.bodyRows, (row) => {
        const cols = opts.bodyTopCols + row,
              rowX = -(cols / 2) + 0.5;
        times(opts.bodyRowRepeat, (rowOffset) => {
          const rowY = opts.loopRows + (row * opts.bodyRowRepeat) + rowOffset;
          times(cols, (col) => {
            beads.push({
              beadId: null,
              col: rowX + col,
              row: rowY
            })
          })
        });
      });

      const totalCols = opts.bodyTopCols + opts.bodyRows,
            rowX      = -(totalCols / 2) + 0.5;

      times(totalCols, (col) => {
        times(opts.fringeRows, (row) => {
          const rowY = opts.loopRows + (opts.bodyRows * opts.bodyRowRepeat) + row;
          beads.push({
            beadId: null,
            fCol: col,
            fRow: row,
            col: rowX + col,
            row: rowY
          })
        });
      });

    } else if (template.id === 'square') {

      times(opts.bodyRows, (row) => {
        const cols = opts.bodyTopCols,
              rowX = -(cols / 2) + 0.5,
              rowY = opts.loopRows + row;
        times(cols, (col) => {
          beads.push({
            beadId: null,
            col: rowX + col,
            row: rowY
          });
        });
      });
      const rowX = -(opts.bodyTopCols / 2) + 0.5;
      times(opts.bodyTopCols, (col) => {
        times(opts.fringeRows, (row) => {
          const rowY = opts.loopRows + opts.bodyRows + row;
          beads.push({
            beadId: null,
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
      times(topRows, (row) => {
        const cols = opts.bodyTopCols + row,
              rowX = -(cols / 2) + 0.5;
        times(opts.bodyRowRepeat, (rowOffset) => {
          const rowY = opts.loopRows + (row * opts.bodyRowRepeat) + rowOffset;
          times(cols, (col) => {
            beads.push({
              beadId: null,
              col: rowX + col,
              row: rowY
            })
          })
        });
      });
      times(btmRows, (row) => {
        const cols = (opts.bodyTopCols + topRows) - row,
              rowX = -(cols / 2) + 0.5;
        times(opts.bodyRowRepeat, (rowOffset) => {
          const rowY = opts.loopRows + (topRows * opts.bodyRowRepeat) + (row * opts.bodyRowRepeat) + rowOffset;
          times(cols, (col) => {
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
        col: 0,
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
    beads,
    fringeCols
  };

}
