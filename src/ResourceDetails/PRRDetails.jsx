import React from 'react';

const PRRDetails = ({
  clientName,
  displayCode,
  submissionUI,
  urlBase,
  urlPathPrefix,
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
  </React.Fragment>
);

export default PRRDetails;
