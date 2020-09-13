
import { times } from 'lodash';

export function generateDesign(template, userOpts) {

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

  const opts = getOpts(template.opts, userOpts);

  const design = [];

  times(opts.loopRows, (row) => {
    if (row === 0) {
      design.push(
        { beadId: null, col: -0.5, row: row },
        { beadId: null, col:  0.5, row: row }
      );
    } else {
      design.push(
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
          design.push({
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
        design.push({
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
        design.push({
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
        design.push({
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
          design.push({
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
          design.push({
            beadId: null,
            col: rowX + col,
            row: rowY
          })
        })
      });
    });

    design.push({
      beadId: null,
      col: 0,
      row: opts.loopRows + ((topRows + btmRows) * opts.bodyRowRepeat)
    })

  }

  return design;

}

export function encodeDesign(design) {

  const encoded = { };

  design.forEach((bead, index) => {

    const id = bead.beadId || '_';

    if (!encoded[id]?.length) {
      encoded[id] = '';
    }

    encoded[id] += `${bead.col},${bead.row}`;

    if (bead.fCol !== undefined && bead.fRow !== undefined) {
      encoded[id] += `|${bead.fCol},${bead.fRow}`;
    }

    if (index < design.length - 1) {
      encoded[id] += ' ';
    }

  })

  return encoded;

}

export function decodeDesign(encoded) {

  const design = [];

  Object.keys(encoded).forEach((beadId) => {

    const items = encoded[beadId]
      .split(' ')
      .filter((item) => !!item.length);

    items.forEach((item) => {

      const itemSplit = item.split('|'),
            splitA    = itemSplit[0],
            splitB    = itemSplit[1];

      const bead = { };

      if (beadId !== '_') {
        bead.beadId = beadId;
      }

      if (splitB?.length) {
        const fColRow = splitB.split(',');
        bead.fCol = Number(fColRow[0]);
        bead.fRow = Number(fColRow[1]);
      }

      if (splitA?.length) {
        const colRow = splitA.split(',');
        bead.col = Number(colRow[0]);
        bead.row = Number(colRow[1]);
      }

      if (bead.col !== undefined && bead.row !== undefined) {
        design.push(bead);
      }

    });

  });

  return design;

}
