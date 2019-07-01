import React from 'react';

const colorArray = ['red', 'yellow', 'green'];

const StatusLight = ({ status, handleClick, onResourcePage }) => (
  <React.Fragment>
    <div
      onClick={status ? handleClick : null}
      // These lights can appear either on the basic extension page, or alongside the title
      // on the resource detail page, so there is some conditional styling to account for this.
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
          {/* Not a huge fan of this, but couldn't figure out how else to get these spaced correctly.
          If you're a CSS wizard, please help! */}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {status
            ? status.score === 2
              ? 'Good'
              : status.score === 1
              ? 'Fair'
              : 'Poor'
            : 'N/A'}
        </span>
      )}
    </div>
  </React.Fragment>
);

export default StatusLight;
