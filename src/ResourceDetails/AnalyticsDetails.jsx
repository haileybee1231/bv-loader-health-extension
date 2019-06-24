import React from 'react';
import TableRow from '../Generic/TableRow.jsx';

class AnalyticsDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    Object.keys(this.props.BVA.trackers).forEach(tracker => {
      this.setState({
        [`${tracker}Open`]: false
      })
    })
  }

  renderConfigObj = configObj => {
    // Analytics events can be nested objects, so this provides a recursive way to render them
    return Object.entries(configObj).map((configTuple, index) => {
      if (typeof configTuple[1] !== 'object' || configTuple[1] === null) {
        return (
          <TableRow
            name={configTuple[0]}
            value={configTuple[1] || 'Undefined'}
            key={index}
          />
        )
      } else {
        if (!['_batch', '_idQueue', '_requestQueue'].includes(configTuple[0])) {
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
      }
    })
  }

  toggleSection = section => {
    this.setState({
      [section]: !this.state[section]
    });
  }

  render() {
    const {
      analyticsDetails: {
        pixel,
        fingerprintingEnabled,
        analyticsVendors,
        sci,
        trackingDataRegion,
      },
      BVA
    } = this.props;

    return (
      <React.Fragment>
      <h3>Pixel</h3>
      {pixel ? 'Enabled' : 'Disabled'}
      <h3>Fingerprinting Enabled</h3>
      {String(fingerprintingEnabled)}
      <h3>Analytics Vendors</h3>
      {analyticsVendors ? Object.keys(analyticsVendors).join(', ') : 'Analytics Vendors Not Detected'}
      <h3>Sci Trackers Enabled</h3>
      {String(sci)}
      <h3>Tracking Data Region</h3>
      {trackingDataRegion}
      <h3>loadId</h3>
      {BVA.loadId}
      <h3>Trackers</h3>
      {BVA && (
        Object.entries(BVA.trackers).map(([tracker, details], index) =>
          <React.Fragment key={index}>
            <h4
              onClick={() => this.toggleSection(`${tracker}Open`)}
              style={{ cursor: 'pointer' }}
            >
              <i className={this.state[`${tracker}Open`] ? 'icon-chevron-up' : 'icon-chevron-down'} />
              {tracker}
            </h4>
            {this.state[`${tracker}Open`] && (
              <table>
                <tbody>
                  {this.renderConfigObj(details)}
                </tbody>
              </table>
            )}
          </React.Fragment>
        )
      )}
    </React.Fragment>
    )
  }
}

export default AnalyticsDetails;