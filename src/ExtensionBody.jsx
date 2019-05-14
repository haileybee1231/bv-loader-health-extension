import React from 'react';
import ResourceList from './ResourceList.jsx';
import AnalyticsList from './AnalyticsList.jsx';

class ExtensionBody extends React.Component {
  render() {
    const { resources, analytics, changed } = this.props;
    return (
      <div style={{ paddingLeft: '20px' }}>
        <h2>Resources</h2>
        <ResourceList resources={resources} changed={changed} />
        <h2>Analytics</h2>
        <AnalyticsList analytics={analytics} changed={changed} />
      </div>
    )
  }
}

export default ExtensionBody;