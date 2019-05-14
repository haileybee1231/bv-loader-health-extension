import React from 'react';
import AnalyticsTableRow from './AnalyticsTableRow.jsx';

const transformEvent = event => {
  const outputArr = [];
  for (const prop in event) {
    outputArry.push([prop, event[prop]]);
  }
  return outputArr;
}

const AnalyticsList = ({ analytics }) => (
  <table style={{ width: '80%', margin: 'auto' }}>
    {analytics.map(analyticEvent => {
      // const propArr = transformEvent(analyticEvent);
      // return (
      //   <React.Fragment>
      //     {propArr.map(tuple =>
      //       <AnalyticsTableRow name={propTuple[0]} value={propTuple[1]} />
      //     )}
      //   </React.Fragment>
      // )
    })}
  </table>
)

export default AnalyticsList;