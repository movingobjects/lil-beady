
import { times } from 'lodash';

export function generateLayout(template, userOpts) {

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

export function encodeProject(project) {

  const encodeLayout = (layout) => {

    const beads = { };

    layout.forEach((b) => {

      const id = b.beadId || '_';

      if (!beads[id]?.length) {
        beads[id] = '';
      }

      beads[id] += `${b.col},${b.row}`;

      if (b.fCol !== undefined && b.fRow !== undefined) {
        beads[id] += `|${b.fCol},${b.fRow}`;
      }

      beads[id] += ' ';

    })

    return beads;

  }

  return {
    name: project.name,
    templateId: project.templateId,
    beads: encodeLayout(project.layout)
  };

}
export function decodeProject(data) {

  const decodeBeads = (beadGroups) => {

    const layout = [];

    const beadIds = Object.keys(beadGroups);

    beadIds.forEach((id) => {
      const group = beadGroups[id];
      const beads = group.split(' ').filter((b) => !!b.length);

      beads.forEach((b) => {

        const beadSplit = b.split('|');
        const colRow = beadSplit[0].split(',');

        const obj = {
          col: Number(colRow[0]),
          row: Number(colRow[1])
        };

        if (beadSplit[1]?.length) {
          const fColRow = beadSplit[1].split(',');
          obj.fCol = Number(fColRow[0]);
          obj.fRow = Number(fColRow[1]);
        }

        if (id !== '_') {
          obj.beadId = id;
        }

        layout.push(obj);

      });

    });

    return layout;

  }

  return {
    name: data.name,
    templateId: data.templateId,
    layout: decodeBeads(data.beads)
  }
}
