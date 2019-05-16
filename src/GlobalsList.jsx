import React from 'react';
import TableRow from './TableRow.jsx';

class GlobalsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      BV: null,
      $BV: null,
      containers: []
    }
  }

  componentDidMount() {
    this.pollForContainers(500);
  }

  pollForContainers = (interval, containerNodeList) => {
    containerNodeList = document.querySelectorAll('[data-bv-show');
    if (containerNodeList.length && this.props.BV) {
      this.setGlobalsState(containerNodeList);
    } else {
      setTimeout(() => this.pollForContainers(interval, containerNodeList), interval)
    }
  }

  setGlobalsState = containerNodeList => {
    const containers =
      [...containerNodeList]
        .map(container => container.dataset);

    const scriptAttrs = this.props.getBvJsScriptTag();

    if (this.props.BV) {
      const {
        global: {
          dataEnv,
          serverEnv,
          siteId
        },
        options: {
          apiconfig: {
            bvLocalKey,
            displayCode,
            limit,
            passKey
          },
          pixel,
          _render
        }
      } = this.props.BV;

      this.setState({
        BV: { 
          dataEnv,
          serverEnv,
          siteId,
          apiKey: passKey,
          bvLocalKey,
          displayCode,
          limit,
          _render: !!_render,
          pixel: !!pixel
        },
        containers,
        scriptAttrs
      });
    }
  }

  render() {
    const {
      globalsOpen,
      toggleSection,
      scriptAttrs,
      handleClick
    } = this.props;

    const {
      containers,
      BV,
      $BV
    } = this.state;

    return (
      <React.Fragment>
        <h2
          onClick={() => toggleSection('globals')}
          style={{ cursor: 'pointer' }}
        >
          <i className={globalsOpen ? 'icon-chevron-up' : 'icon-chevron-down'} />
          Globals
        </h2>
        {globalsOpen && (
          <React.Fragment>
            <h4>Containers</h4>
            {containers.length ? (
              <React.Fragment>
                <table style={{ width: '80%', margin: 'auto' }}>
                  {containers.map((container, index) => {
                    const containerCopy = { ...container };
                    delete containerCopy.bvShow;
  
                    const containerArr = Object.entries(containerCopy);
  
                    return (
                      <React.Fragment key={index}>
                        <thead style={{ padding: 'auto' }}>
                          <tr>
                            <th>data-bv-show: <em>{container.bvShow}</em></th>
                          </tr>
                        </thead>
                        <tbody>
                          {containerArr.map((tuple, index) =>
                            <TableRow
                              name={tuple[0]}
                              value={tuple[1]}
                              key={index}
                            />
                          )}
                        </tbody>
                      </React.Fragment>
                    )
                  })}
                </table>
              </React.Fragment>
            ) : (
              <img
                src={`${chrome.extension.getURL('/assets/images/loading-spinner.svg')}`}
                style={{ height: '40px' }}
              />
            )}
            <h4>bv.js Script Tag</h4>
            {scriptAttrs.length ? (
              <React.Fragment>
                <table style={{ width: '80%', margin: 'auto' }}>
                  <tbody>
                  {scriptAttrs.map((tuple, index) =>
                    <TableRow
                      name={tuple[0]}
                      value={tuple[1]}
                      key={index}
                    />
                  )}
                  </tbody>
                </table>
              </React.Fragment>
            ) : (
              <img
                src={`${chrome.extension.getURL('/assets/images/loading-spinner.svg')}`}
                style={{ height: '40px' }}
              />
            )}
            <h4>Global BV Namespace</h4>
            {BV ? (
              <React.Fragment>
                {JSON.stringify(this.propsBV, null, 4)}
                {/* <table style={{ width: '80%', margin: 'auto' }}>
                  <tbody>
                  {Object.entries(BV).map((tuple, index) =>
                    <TableRow
                      name={tuple[0]}
                      value={String(tuple[1])}
                      key={index}
                    />
                  )}
                  </tbody>
                </table> */}
              </React.Fragment>
            ) : (
              <img
                src={`${chrome.extension.getURL('/assets/images/loading-spinner.svg')}`}
                style={{ height: '40px' }}
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

export default GlobalsList;