import React from 'react';

const AnalyticsDetails = ({
  analyticsDetails: {
    pixel,
    fingerprintingEnabled,
    analyticsVendors,
    sci,
    trackingDataRegion
  }
}) => (
  <React.Fragment>
    <h3>Pixel</h3>
    {pixel ? 'Enabled' : 'Disabled'}
    <h3>Fingerprinting Enabled</h3>
    {String(fingerprintingEnabled)}
    <h3>Analytics Vendors</h3>
    {Object.keys(analyticsVendors).join(', ')}
    <h3>Sci Trackers Enabled</h3>
    {String(sci)}
    <h3>Tracking Data Region</h3>
    {trackingDataRegion}
  </React.Fragment>
)

export default AnalyticsDetails;