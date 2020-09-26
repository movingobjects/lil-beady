
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
      <path d="M229.9 473.899l19.799-19.799c4.686-4.686 4.686-12.284 0-16.971L94.569 282H436c6.627 0 12-5.373 12-12v-28c0-6.627-5.373-12-12-12H94.569l155.13-155.13c4.686-4.686 4.686-12.284 0-16.971L229.9 38.101c-4.686-4.686-12.284-4.686-16.971 0L3.515 247.515c-4.686 4.686-4.686 12.284 0 16.971L212.929 473.9c4.686 4.686 12.284 4.686 16.971-.001z" />
    </g>
  </svg>

);

export default Icon;
