import React from 'react';

const ExtensionHeader = () => (
  <header
    id="bv_sidebar_header"
    className="navbar navbar-inverse navbar-portal navbar-fixed-top"
    style={{ position: 'relative' }}
  >
    <div className="navbar-inner">
      <div className="container-fluid">
        <div
          className="brand brand-bv"
          style={{ lineHeight: '28.5714px' }}
        ></div>
        <p className="navbar-text no-float">
          bv-loader Client Health Inspector
        </p>
      </div>
    </div>
  </header>
);

export default ExtensionHeader;
