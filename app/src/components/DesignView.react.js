
// Imports

import * as React from 'react';
import * as _ from 'lodash';

import templates from '../data/templates.json';


// Constants


// Class

export default class DesignView extends React.Component {

  // Constructor

  constructor() {

    super();

    this.initState();

  }

  initState() {

    this.state = {
      templateIndex: 1
    }

  }


  // Event handlers

  onKeyDown = (e) => {

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const offset   = (e.key === 'ArrowLeft') ? -1 : 1,
            newIndex = Math.max(0, Math.min(templates.length - 1, this.state.templateIndex + offset));
      this.setState({
        templateIndex: newIndex
      })

    }

  }


  // Methods

  generateLayout(template, userOpts) {

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

    const getLoopRows = (templateId, opts) => {

      const rows = [ ];

      _.times(opts.loopRows, (row) => {
        if (row === 0) {
          rows.push([ 1, 1 ]);
        } else {
          rows.push([ 1, 0, 1 ]);
        }
      });

      return rows;

    }

    const getTopRows = (templateId, opts) => {

      const rows = [];

      if (templateId === 'triangle') {
        _.times(opts.topHeight, (i) => {
          const cols = opts.topCols + i,
                row  = _.times(cols, () => 1);
          _.times(opts.rowHeight, (j) => {
            rows.push(row);
          });
        });

      } else if (template.id === 'square') {
        _.times(opts.topHeight, (i) => {
          const cols = opts.topCols,
                row  = _.times(cols, () => 1);
          rows.push(row);
        });


      } else if (template.id === 'diamond') {

      }

      return rows;

    }

    const getFringeRows = (templateId, opts) => {

      const rows = [];

      if (templateId === 'triangle') {
        _.times(opts.fringeHeight, (i) => {
          const cols = opts.topCols + opts.topHeight,
                row  = _.times(cols, () => 2);
          rows.push(row);
        });

      } else if (template.id === 'square') {
        _.times(opts.fringeHeight, (i) => {
          const cols = opts.topCols,
                row  = _.times(cols, () => 2);
          rows.push(row);
        });

      } else if (template.id === 'diamond') {

      }

      return rows;

    }

    const opts = getOpts(template.opts, userOpts);

    return [
      ...getLoopRows(template.id, opts),
      ...getTopRows(template.id, opts),
      ...getFringeRows(template.id, opts)
    ];

  }


  // React

  componentDidMount() {

    document.addEventListener('keydown', this.onKeyDown);

  }
  componentWillUnmount() {

    document.removeEventListener('keydown', this.onKeyDown);

  }


  render() {

    const {
      templateIndex
    } = this.state;

    const template = templates[templateIndex],
          layout   = this.generateLayout(template);

    const areaW   = 700,
          areaH   = 875,
          centerX = areaW / 2,
          colW    = 12,
          rowH    = 10,
          beadW   = 10,
          beadH   = 8;

    return (
      <section id='design-view'>

        <div className='wrap-design'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox={`0 0 ${areaW} ${areaH}`}
          >

            {layout.map((row, i) => {

              const rowLen = row.length,
                    rowX = centerX - (rowLen * colW) / 2;

              return row.map((bead, j) => {
                if (bead) {
                  return (
                    <rect
                      key={`row-${i}-bead-${j}`}
                      x={rowX + (j * colW)}
                      y={i * rowH}
                      width={beadW}
                      height={beadH}
                      rx='2'
                      style={{
                        fill: (bead === 1) ? '#666' : '#ccc'
                      }}
                    />
                  )
                }
              })

            })}

          </svg>

        </div>

      </section>
    )

  }

}
