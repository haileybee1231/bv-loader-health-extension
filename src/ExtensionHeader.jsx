import React from 'react';

class ExtensionHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <header
        id="bv_sidebar_header"
        className="navbar navbar-inverse navbar-portal navbar-fixed-top"
        style={{ position: 'relative' }}
      >
        <div className="navbar-inner">
          <div className="container-fluid">
            <div className="brand brand-bv"></div>
            <p className="navbar-text">Analytics Inspector</p>
          </div>
        </div>
      </header>
    )
  }
}

export default ExtensionHeader;