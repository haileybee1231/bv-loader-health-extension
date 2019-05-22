import React from 'react';
import ResourceList from './ResourceList.jsx';
import AnalyticsList from './AnalyticsList.jsx';
import PerfMarksList from './PerfMarksList.jsx';
import ResourcePage from './ResourcePage.jsx';
import GlobalsList from './GlobalsList.jsx';
class ExtensionBody extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResource: false,
      resourceName: '',
      version: '',
      resouceDetails: {},
      resourcesOpen: false,
      globalsOpen: false,
      perfMarksOpen: false,
      analyticsOpen: false,
      bvJsScriptAttrs: []
    }
  }

  componentWillReceiveProps({ selectedResource }) {
    if (selectedResource && !this.state.version) {
      this.getVersion(selectedResource.url)
    }
  }

  handleClick = (resourceName, resource) => {
    this.setState({
      showResource: !this.state.showResource,
      resourceName
    });

    if (resource) {
      this.props.handleResourceClick(resource);
    }
  }

  resetVersion = () => this.setState({ version: '' })

  toggleSection = section => {
    const str = `${section}Open`;
    this.setState({
      [str]: !this.state[str]
    })
  }

  getBvJsScriptTag = () => {
    const bvJsScriptTag = document.querySelector('[src*="bv.js"]');
    const { attributes } = bvJsScriptTag;
    const bvJsScriptAttrs = [];
    const foundAttrs = {};

    for (let i = 0; i < attributes.length; i++) {
      let { nodeName, nodeValue } = attributes[i];
      nodeValue = nodeName === 'async' || nodeName === 'defer' ? <em>true</em> : nodeValue;
      foundAttrs[nodeName] = nodeValue;
      if (nodeName !== 'type') {
        bvJsScriptAttrs.push([nodeName, nodeValue]);
      }
    }

    if (!foundAttrs.defer) {
      bvJsScriptAttrs.push(['defer', 'false']);
    }

    if (!foundAttrs.async) {
      bvJsScriptAttrs.push(['async', 'false']);
    }

    this.setState({
      bvJsScriptAttrs
    });
  }

  getVersion = url => {
    fetch(url)
      .then(response => response.text()
        .then(text => {
          this.setState({
            resourceDetails: this.parseResponse(text),
          })
        })
      )
  }

  parseResponse = text => {
    const resourceDetails = {}, { resourceName } = this.state;

    if (resourceName === 'bv.js') {
      resourceDetails.capabilitiesArr = text.split('*/')[0].match(/[A-Za-z]+?_?[A-Za-z]+@[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}/g);
      resourceDetails.client = /client:"([A-Za-z0-9-_]*)"/.exec(text)[1];
      resourceDetails.site = /site:"([A-Za-z0-9-_]+)"/.exec(text)[1];
      resourceDetails.environment = /environment:"([a-z]+)"/.exec(text)[1];
      resourceDetails.locale = /locale:"([a-z]+_[A-Z]+)"/.exec(text)[1];
      resourceDetails.buildTime = text.match(/\b(?:(?:Mon)|(?:Tues?)|(?:Wed(?:nes)?)|(?:Thur?s?)|(?:Fri)|(?:Sat(?:ur)?)|(?:Sun))(?:day)?\b[:\-,]?\s*[a-zA-Z]{3,9}\s+\d{1,2}\s*,?\s*\d{4} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} GMT\+[0-9]{4}/g);
      resourceDetails.version = text.match(/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/)
    } else if (resourceName === 'PRR') {
      let configuration;

      try {
        configuration = JSON.parse(/\$BV\.configure\((.*)\);/.exec(text)[1]);

        const { global } = configuration;

        resourceDetails.version = global.version;
        resourceDetails.clientName = global.clientName;
        resourceDetails.displayCode = global.displayCode;
        resourceDetails.submissionUI = global.submissionUI;
        resourceDetails.urlBase = global.urlBase;
        resourceDetails.urlPathPrefix = global.urlPathPrefix || '""';
      }
      catch (e) {
        console.error(e)
      }
    } else if (resourceName === 'Firebird') {
      let configuration;
      
      try {
        configuration = new Function('return' + /e\.exports=({rawFirebirdConfig:.*\(UTC\)"})/.exec(text)[1])();
        const { rawFirebirdConfig } = configuration;

        resourceDetails.version = configuration.firebirdVersion;
        resourceDetails.env = configuration.env;
        resourceDetails.siteId = configuration.siteId;
        resourceDetails.buildTime = configuration.date;

        const { implementations: { weights } } = rawFirebirdConfig;
        resourceDetails.implementations = [];
        Object.keys(weights).forEach(implementation => {
          const implementationObj = {};
          const config = rawFirebirdConfig.configs[implementation]

          implementationObj.locale = config.locale;
          implementationObj.containers = {
            ...config.containers
          };
          implementationObj.displayCode = config.displaycode;
          implementationObj.clientName = config.clientname;
          implementationObj.piiDataRegion = config.piiDataRegion;
          implementationObj.deploymentId = config.deploymentId;
          implementationObj.deploymentPath = config.deploymentPath;
          implementationObj.deploymentVersion = config.deploymentVersion;
          implementationObj.revision = config.revision;

          resourceDetails.implementations.push({ [implementation]: implementationObj })
        })
      }
      catch (e) {
        console.error(e)
      }
    } else {
      resourceDetails.version = text.match(/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/);
    }

    return resourceDetails;
  }

  render() {
    const {
      resources,
      analytics,
      perfMarks,
      changed,
      totalAnalytics,
      totalPerfMarks,
      firstParty,
      thirdParty,
      selectedResource,
      anonymous,
      BV,
      $BV
    } = this.props;

    return (
      this.state.showResource
        ? (
          <ResourcePage
            resourceName={this.state.resourceName}
            resourceDetails={this.state.resourceDetails}
            selectedResource={selectedResource}
            handleClick={this.handleClick}
            resetVersion={this.resetVersion}
            bvJsScriptAttrs={this.state.bvJsScriptAttrs}
            getBvJsScriptTag={this.getBvJsScriptTag}
          />
        ) : (
          <div style={{ paddingLeft: '20px' }}>
            <ResourceList
              resources={resources}
              changed={changed}
              resourcesOpen={this.state.resourcesOpen}
              toggleSection={this.toggleSection}
              handleClick={this.handleClick}
            />
            <GlobalsList
              globalsOpen={this.state.globalsOpen}
              toggleSection={this.toggleSection}
              handleClick={this.handleClick}
              BV={BV}
              $BV={$BV}
              getBvJsScriptTag={this.getBvJsScriptTag}
              bvJsScriptAttrs={this.state.bvJsScriptAttrs}
              changed={changed}
            />
            <PerfMarksList
              perfMarks={perfMarks}
              totalPerfMarks={totalPerfMarks}
              perfMarksOpen={this.state.perfMarksOpen}
              toggleSection={this.toggleSection}
              changed={changed}
            />
            <AnalyticsList
              analytics={analytics}
              totalAnalytics={totalAnalytics}
              analyticsOpen={this.state.analyticsOpen}
              toggleSection={this.toggleSection}
              firstParty={firstParty}
              thirdParty={thirdParty}
              anonymous={anonymous}
              changed={changed}
            />
          </div>
        )
    )
  }
}

export default ExtensionBody;