import React, { useState, ReactChildren, ReactChild, ReactNode } from "react";

// https://commons.wikimedia.org/wiki/File:Icons8_flat_alarm_clock.svg
export const Clock1 = () => (
  <svg
    version="1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    enable-background="new 0 0 48 48"
  >
    <g fill="#37474F">
      <path d="M38.5,44.6l-4-4l2.1-2.1l4,4c0.6,0.6,0.6,1.5,0,2.1l0,0C40.1,45.1,39.1,45.1,38.5,44.6z" />
      <path d="M9.5,44.6l4-4l-2.1-2.1l-4,4c-0.6,0.6-0.6,1.5,0,2.1l0,0C7.9,45.1,8.9,45.1,9.5,44.6z" />
    </g>
    <circle fill="#C62828" cx="24" cy="24" r="20" />
    <circle fill="#eee" cx="24" cy="24" r="16" />
    <rect
      x="19"
      y="22.1"
      transform="matrix(-.707 -.707 .707 -.707 12.904 62.537)"
      fill="#E53935"
      width=".8"
      height="13"
    />
    <rect x="23" y="11" width="2" height="13" />
    <rect
      x="26.1"
      y="22.7"
      transform="matrix(-.707 .707 -.707 -.707 65.787 27.25)"
      width="2.3"
      height="9.2"
    />
    <circle cx="24" cy="24" r="2" />
    <circle fill="#C62828" cx="24" cy="24" r="1" />
    <rect x="22" y="1" fill="#37474F" width="4" height="3" />
    <g fill="#37474F">
      <path d="M44.4,16.2c2.5-3.5,2.1-8.4-1-11.5c-3.1-3.1-8-3.5-11.5-1L44.4,16.2z" />
      <path d="M3.6,16.2c-2.5-3.5-2.1-8.4,1-11.5c3.1-3.1,8-3.5,11.5-1L3.6,16.2z" />
    </g>
  </svg>
);

export const Clock2 = () => (
  <svg
    version="1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    enable-background="new 0 0 48 48"
  >
    <circle fill="#C62828" cx="24" cy="24" r="20" />
    <circle fill="#eee" cx="24" cy="24" r="16" />
    <rect
      x="19"
      y="22.1"
      transform="matrix(-.707 -.707 .707 -.707 12.904 62.537)"
      fill="#E53935"
      width=".8"
      height="13"
    />
    <rect x="23" y="11" width="2" height="13" />
    <rect
      x="26.1"
      y="22.7"
      transform="matrix(-.707 .707 -.707 -.707 65.787 27.25)"
      width="2.3"
      height="9.2"
    />
    <circle cx="24" cy="24" r="2" />
    <circle fill="#C62828" cx="24" cy="24" r="1" />
  </svg>
);

export const Arrow = (props: { width: number; dir: string }) => {
  let rotation = 0;
  switch (props.dir) {
    case "left":
      break;
    case "right":
      rotation = 180;
      break;
    case "up":
      rotation = 90;
      break;
    case "down":
      rotation = -90;
      break;
  }
  return (
    <svg
      version="1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 600"
      width={props.width}
      transform={`rotate(${rotation})`}
      // enable-background="new 0 0 48 48"
    >
      <PolyArrow />
    </svg>
  );
};

const PolyArrow = () => (
  <g>
    <rect width="400" height="600" rx="150" fill="red" />
    <polygon
      points="240,521 240,411 561,411 561,152 240,152 240,40 0,280 		
    "
    />
  </g>
);
/*

<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>

*/
