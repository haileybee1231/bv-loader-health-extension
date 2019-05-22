import React from 'react';
import BvJSDetails from './BvJsDetails.jsx';
import PRRDetails from './PRRDetails.jsx';
import FirebirdDetails from './FirebirdDetails.jsx';

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
      resetVersion,
      selectedResource,
      bvJsScriptAttrs
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
      implementations
    } = resourceDetails

    return (
      <div style={{ paddingLeft: '10px', paddingTop: '10px' }}>
        <a
          onClick={() => {
            resetVersion();
            handleClick(null);
          }}
        ><i className='icon-arrow-left'></i></a>
        <div className="inline-headers">
          <h1 style={{ marginRight: '4px' }}>{resourceName}</h1>
          <em>{`${version ? 'v' : 'Resource not found.'}${version}`}</em>
        </div>
        <div>
        {resourceName === 'bv.js' && (
          <BvJSDetails
            capabilitiesArr={capabilitiesArr}
            client={client}
            site={site}
            environment={environment}
            locale={locale}
            buildTime={buildTime}
            bvJsScriptAttrs={bvJsScriptAttrs}
          />
        )}
        {resourceName === 'PRR' && (
          <PRRDetails
            clientName={clientName}
            displayCode={displayCode}
            submissionUI={submissionUI}
            urlBase={urlBase}
            urlPathPrefix={urlPathPrefix}
          />
        )}
        {resourceName === 'Firebird' && (
          <FirebirdDetails
            buildTime={buildTime}
            env={env}
            siteId={siteId}
            implementations={implementations}
          />
        )}
        </div>
      </div>
    )
  }
}

export default ResourcePage;
