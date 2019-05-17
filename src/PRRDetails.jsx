import React from 'react';
import TableRow from './TableRow.jsx';

const PRRDetails = ({
  clientName,
  displayCode,
  submissionUI,
  urlBase,
  urlPathPrefix
}) => (
  <React.Fragment>
    <h3>Client</h3>
    {clientName}
    <h3>Display Code</h3>
    {displayCode}
    <h3>Submission UI</h3>
    {submissionUI}
    <h3>URL Base</h3>
    {urlBase}
    <h3>URL Path Prefix</h3>
    {urlPathPrefix}
    {/* <h3>Build Time</h3>
    {new Date(buildTime).toDateString()}, {new Date(buildTime).toLocaleTimeString('english')}
    <h3>Capabilities</h3>
    <ul>
      {capabilitiesArr.map((app, index) =>
        <li key={index}>{`• ${app.replace('@', ', v')}`}</li>
      )}
    </ul>
    <h3>Script Tag</h3>
    <table>
      <tbody>
        {scriptAttrs.map((tuple, index) =>
          <TableRow name={tuple[0]} value={tuple[1]} key={index} />
        )}
      </tbody>
    </table> */}
  </React.Fragment>
)

export default PRRDetails;