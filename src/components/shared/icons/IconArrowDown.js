
import * as React from 'react';

const Icon = ({
  size = 50,
  color = 'white'
}) => (

  <svg
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 448 512'
    width={`${size}px`}
    height={`${size}px`}>
    <g stroke='none' fill={color}>
      <path d="M441.9 250.1l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L250 385.4V44c0-6.6-5.4-12-12-12h-28c-6.6 0-12 5.4-12 12v341.4L42.9 230.3c-4.7-4.7-12.3-4.7-17 0L6.1 250.1c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z" />
    </g>
  </svg>

);

export default Icon;
