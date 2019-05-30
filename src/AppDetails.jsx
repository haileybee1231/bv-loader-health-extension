import React from 'react';
import TableRow from './TableRow.jsx';

class AppDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appAttrs: []
    }
  }

  componentDidMount() {
    if (this.props.appDetails._analytics.commonData) {
      const { name } = this.props.appDetails._analytics;

      const containerNodeList = document.querySelectorAll(`[data-bv-show="${name === 'inline_ratings' ? 'inline_rating' : name}"]`);
      const appAttrs = [...containerNodeList]
        .map(container => container.dataset);

      this.setState({ appAttrs });
    }
  }

  renderConfigObj = configObj => {
    return Object.entries(configObj).map((configTuple, index) => {
      if (typeof configTuple[1] !== 'object') {
        return <TableRow name={configTuple[0]} value={configTuple[1]} key={index} />
      } else {
        if (Array.isArray(configTuple[1])) {
          return (
            <React.Fragment key={index}>
              <tr>
                <td><em>{configTuple[0]}:</em></td>
              </tr>
              {configTuple[1].map((nestedConfig, j) =>
                  <tr key={j}>
                    {typeof nestedConfig === 'object'
                      ? this.renderConfigObj(nestedConfig)
                      : <td key={j}>{nestedConfig}</td>
                    }
                  </tr>
                )
              }
            </React.Fragment>
          )
        } else {
          return (
            <React.Fragment key={index}>
              <tr>
                <td><em>{configTuple[0]}:</em></td>
              </tr>
              {this.renderConfigObj(configTuple[1])}
            </React.Fragment>
          )
        }
      }
    })
  }

  render() {
    const {
      appDetails: {
        config,
        _analytics: {
          commonData
        }
      }
    } = this.props;

    return (
      <React.Fragment>
        <h4>Config</h4>
        <table>
          <tbody>
            {this.renderConfigObj(config)}
          </tbody>
        </table>
        <h4>Analytics</h4>
        <table>
          <tbody>
            {Object.entries(commonData).map((analyticsTuple, index) =>
              <TableRow name={analyticsTuple[0]} value={analyticsTuple[1]} key={index} />
            )}
          </tbody>
        </table>
        <h4>Containers</h4>
        {this.state.appAttrs.length && (
          <React.Fragment>
            <table style={{ width: '80%', margin: 'auto' }}>
              {this.state.appAttrs.map((container, index) => {
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
        )}
      </React.Fragment>
    )
  }
  
};

export default AppDetails;