import React from 'react';

const colorArray = ['red', 'yellow', 'green'];

const StatusLight = ({ status, handleClick, onResourcePage }) => (
  <div
    onClick={status ? handleClick : null}
    style={{
      backgroundColor: status ? colorArray[status.score] : 'lightgray',
      border: '1px solid black',
      borderRadius: '50%',
      cursor: status && !onResourcePage ? 'pointer' : 'auto',
      display: onResourcePage ? 'inline-block' : 'block',
      height: '20px',
      margin: onResourcePage ? '0 5px 0 0' : 'auto',
      width: '20px'
    }}
  />
)

export default StatusLight;