import React from 'react';
import BvJSDetails from './BvJsDetails.jsx';
import PRRDetails from './PRRDetails.jsx';
import FirebirdDetails from './FirebirdDetails.jsx';
import AppDetails from './AppDetails.jsx';
import AnalyticsDetails from './AnalyticsDetails.jsx';
import FlexDetails from './FlexDetails.jsx';
import StatusLight from '../Generic/StatusLight.jsx';

class ResourcePage extends React.Component {
  componentDidMount() {
    if (this.props.resourceName === 'bv.js' && !this.props.bvJsScriptAttrs.length) {
      this.props.getBvJsScriptTag();
    }
  }

  transformResourceObj = resourceObj => {
    let propArr = [];

    // for (let prop in resourceObj) {
    //   if ()
    // }
  }

  render() {
    const {
      handleClick,
      resourceName,
      resourceDetails = {},
      appDetails,
      flexDetails = {},
      analyticsDetails = {},
      resetVersion,
      selectedResource,
      bvJsScriptAttrs,
      BVA
    } = this.props;
    const {
      version,
      capabilitiesArr = [],
      client,
      site,
      environment,
      locale,
      buildTime,
      clientName,
      displayCode,
      submissionUI,
      urlBase,
      urlPathPrefix,
      siteId,
      env,
      implementations,
      health
    } = resourceDetails

    return (
      <div style={{ paddingLeft: '10px', paddingTop: '10px', paddingBottom: '20px' }}>
        <a
          onClick={() => {
            resetVersion();
            handleClick(null);
          }}
        ><i className='icon-arrow-left'></i></a>
        <div className="inline-headers">
          <StatusLight status={health} onResourcePage />
          <h2 style={{ marginRight: '4px' }}>{resourceName}</h2>
          {resourceName !== 'Flex' && (
            <em>{`${version ? 'v' : 'Resource not found.'}${version}`}</em>
          )}
        </div>
        <div>
          {health && health.score < 2 && (
            <React.Fragment>
              <h3>Health Report</h3>
              <h4>Number of Issues Found</h4>
              {Object.keys(health).length - 1}
              <ul>
                {Object.keys(health).map((issue, index) =>
                  issue === 'score' ? null : <li key={index}>{issue}</li>
                )}
              </ul>
            </React.Fragment>
          )}
          {resourceName === 'bv.js' && (
            <BvJSDetails
              capabilitiesArr={capabilitiesArr}
              client={client}
              site={site}
              environment={environment}
              locale={locale}
              buildTime={buildTime}
              bvJsScriptAttrs={bvJsScriptAttrs}
              health={health}
            />
          )}
          {resourceName === 'PRR' && (
            <PRRDetails
              clientName={clientName}
              displayCode={displayCode}
              submissionUI={submissionUI}
              urlBase={urlBase}
              urlPathPrefix={urlPathPrefix}
              health={health}
            />
          )}
          {resourceName === 'Firebird' && (
            <FirebirdDetails
              buildTime={buildTime}
              env={env}
              siteId={siteId}
              implementations={implementations}
              health={health}
            />
          )}
          {resourceName === 'analytics.js' && (
            <AnalyticsDetails
              analyticsDetails={analyticsDetails}
              BVA={BVA}
              health={health}
            />
          )}
          {resourceName === 'Flex' && (
            <FlexDetails
              flexDetails={flexDetails}
              resourceDetails={resourceDetails}
              health={health}
            />
          )}
          {appDetails && (
            <AppDetails
              appDetails={appDetails}
              health={health}
            />
          )}
        </div>
      </div>
    )
  }
}

export default ResourcePage;
