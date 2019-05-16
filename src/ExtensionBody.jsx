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
      scriptAttrs: []
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
    const scriptAttrs = [];
    const foundAttrs = {};

    for (let i = 0; i < attributes.length; i++) {
      let { nodeName, nodeValue } = attributes[i];
      nodeValue = nodeName === 'async' || nodeName === 'defer' ? <em>true</em> : nodeValue;
      foundAttrs[nodeName] = nodeValue;
      if (nodeName !== 'type') {
        scriptAttrs.push([nodeName, nodeValue]);
      }
    }

    if (!foundAttrs.defer) {
      scriptAttrs.push(['defer', 'false']);
    }

    if (!foundAttrs.async) {
      scriptAttrs.push(['async', 'false']);
    }

    this.setState({
      scriptAttrs
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
    const resourceDetails = {};
    if (this.state.resourceName === 'Firebird') {
      resourceDetails.version = /version="([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2})"/.exec(text)[1]
    } else {
      resourceDetails.version = text.match(/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/);
    }

    if (this.state.resourceName === 'bv.js') {
      resourceDetails.capabilitiesArr = text.split('*/')[0].match(/[A-Za-z]+?_?[A-Za-z]+@[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}/g);
      resourceDetails.client = /client:"([A-Za-z0-9-_]*)"/.exec(text)[1];
      resourceDetails.site = /site:"([A-Za-z0-9-_]+)"/.exec(text)[1];
      resourceDetails.environment = /environment:"([a-z]+)"/.exec(text)[1];
      resourceDetails.locale = /locale:"([a-z]+_[A-Z]+)"/.exec(text)[1];
      resourceDetails.buildTime = text.match(/\b(?:(?:Mon)|(?:Tues?)|(?:Wed(?:nes)?)|(?:Thur?s?)|(?:Fri)|(?:Sat(?:ur)?)|(?:Sun))(?:day)?\b[:\-,]?\s*[a-zA-Z]{3,9}\s+\d{1,2}\s*,?\s*\d{4} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} GMT\+[0-9]{4}/g);
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
      BV
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
            scriptAttrs={this.state.scriptAttrs}
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
              getBvJsScriptTag={this.getBvJsScriptTag}
              scriptAttrs={this.state.scriptAttrs}
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