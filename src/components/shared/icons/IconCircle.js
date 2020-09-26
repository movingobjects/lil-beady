
import * as React from 'react';

const Icon = ({
  size = 50,
  color = 'white'
}) => (

  <svg
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 512 512'
    width={`${size}px`}
    height={`${size}px`}>
    <g stroke='none' fill={color}>
      <circle cx='256' cy='256' r='100' />
    </g>
  </svg>

);

export default Icon;
