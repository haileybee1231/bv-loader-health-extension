import React from 'react';
import TableRow from '../Generic/TableRow.jsx';

const BvJSDetails = ({
  capabilitiesArr,
  client,
  site,
  environment,
  locale,
  buildTime,
  bvJsScriptAttrs
}) => (
  <React.Fragment>
    <h3>Client</h3>
    {client}
    <h3>Environment</h3>
    {environment}
    <h3>Site</h3>
    {site}
    <h3>Locale</h3>
    {locale}
    <h3>Build Time</h3>
    {new Date(buildTime).toDateString()}, {new Date(buildTime).toLocaleTimeString('english')}
    <h3>Capabilities</h3>
    <ul>
      {capabilitiesArr.map((app, index) =>
        <li key={index}>{app.replace('@', ', v')}</li>
      )}
    </ul>
    <h3>Script Tag</h3>
    <table>
      <tbody>
        {bvJsScriptAttrs.map((tuple, index) =>
          <TableRow name={tuple[0]} value={tuple[1]} key={index} />
        )}
      </tbody>
    </table>
  </React.Fragment>
)

export default BvJSDetails;