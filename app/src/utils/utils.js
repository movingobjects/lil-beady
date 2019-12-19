
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
          { beadId: 'green', x: -1, y: row },
          { beadId: 'green', x:  0, y: row }
        );
      } else {
        beads.push(
          { beadId: 'green', x: -1.5, y: row },
          { beadId: 'green', x:  0.5, y: row }
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
              beadId: 'red',
              x: rowX + col,
              y: rowY
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
            fringeRow: row,
            x: rowX + col,
            y: rowY
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
            beadId: 'red',
            x: rowX + col,
            y: rowY
          });
        });
      });
      const rowX = -(opts.bodyTopCols / 2);
      _.times(opts.bodyTopCols, (col) => {
        _.times(opts.fringeRows, (row) => {
          const rowY = opts.loopRows + opts.bodyRows + row;
          beads.push({
            beadId: 'blue',
            fringeRow: row,
            x: rowX + col,
            y: rowY
          })
        });
      });


    } else if (template.id === 'diamond') {

    }

    return beads;

  }

  return {
    name: 'Untitled',
    beads: getBeads(getOpts(template.opts, userOpts))
  };

}
