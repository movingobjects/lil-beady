
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
      <path d="M368 224H224V80c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v144H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h144v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V288h144c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" />
    </g>
  </svg>

);

export default Icon;
