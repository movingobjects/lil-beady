
import * as React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

export default class TemplateIcon extends React.Component {

  getPolygonPts(id) {

    switch (id) {
      case 'triangle': return '14.35,2 21,20.60 21,38 5,38 5,20.60 11.70,2';
      case 'square': return '14.23,6 22,6 22,34 4,34 4,6 11.64,6';
      case 'diamond': return '14.38,2 22,18.07 12.99,38 4,18.07 11.60,2';
    }

    return '';

  }

  render() {

    const {
      templateId
    } = this.props;

    return (
      <svg
        width="25px"
        height="40px"
        viewBox="0 0 25 40">
        <g stroke='white' strokeWidth="3" fill="none" strokeLinejoin="round">
          <polygon points={this.getPolygonPts(templateId)} />
        </g>
      </svg>
    );

  }

}
