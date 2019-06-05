import React from 'react';
import TableRow from '../Generic/TableRow.jsx';

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
        return (
          <TableRow
            name={configTuple[0]}
            value={
              (Array.isArray(configTuple[1])
                ? configTuple[1].join(', ')
                : configTuple[1]
              ) || 'Undefined'}
            key={index}
          />
        )
      } else {
        return (
          <React.Fragment key={index}>
            <tr>
              <th><em>{configTuple[0]}:</em></th>
            </tr>
            {this.renderConfigObj(configTuple[1])}
            <tr style={{ height: '10px' }} />
          </React.Fragment>
        )
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
          <div style={{ width: '80%', margin: 'auto' }}>
            {this.state.appAttrs.map((container, index) => {
              const containerCopy = { ...container };
              delete containerCopy.bvShow;
              const containerArr = Object.entries(containerCopy);

              return (
                <React.Fragment key={index}>
                  <b style={{ fontFamily: 'GibsonRegular,Helvetica,Arial,sans-serif', fontSize: '14px' }}>data-bv-show: <em>{container.bvShow}</em></b>
                  <table>
                    <tbody>
                      {containerArr.map((tuple, index) =>
                        <TableRow
                          name={tuple[0]}
                          value={tuple[1]}
                          key={index}
                        />
                      )}
                    </tbody>
                  </table>
                </React.Fragment>
              )
            })}
          </div>
        )}
      </React.Fragment>
    )
  }
  
};

export default AppDetails;