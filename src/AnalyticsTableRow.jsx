import React from 'react';

const AnalyticsTableRow = props => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.value}</td>
    </tr>
  )
}

export default AnalyticsTableRow;