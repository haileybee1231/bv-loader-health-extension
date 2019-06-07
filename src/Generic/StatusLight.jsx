import React from 'react';

const colorArray = ['red', 'yellow', 'green'];

const StatusLight = ({ status, handleClick, onResourcePage }) => (
  <React.Fragment>
    <div
      onClick={status ? handleClick : null}
      style={{
        backgroundColor: status ? colorArray[status.score] : 'lightgray',
        border: '1px solid black',
        borderRadius: '50%',
        cursor: status && !onResourcePage ? 'pointer' : 'auto',
        display: onResourcePage ? 'inline-block' : 'block',
        height: '20px',
        margin: onResourcePage ? '0 5px 0 0' : '0 0 0 25px',
        width: '20px',
        textAlign: 'right',
      }}
    >
      {!onResourcePage && (
        <span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {
            status
              ? status.score === 2
                ? 'Good'
                : status.score === 1
                  ? 'Fair'
                  : 'Poor'
              : 'N/A'
          }
        </span>
      )}
    </div>
  </React.Fragment>
)

export default StatusLight;