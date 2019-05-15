import React from 'react';
import ResourceList from './ResourceList.jsx';
import AnalyticsList from './AnalyticsList.jsx';
import PerfMarksList from './PerfMarksList.jsx';
import ResourcePage from './ResourcePage.jsx';
class ExtensionBody extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResource: false,
      resourceName: '',
      version: '',
      resourcesOpen: false,
      perfMarksOpen: false,
      analyticsOpen: false,
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

  getVersion = url => {
    fetch(url)
      .then(response => response.text()
        .then(text => {
          
          this.setState({
          version: this.parseResponse(text)
        })})
      )
  }

  parseResponse = text => {
    const { resourceName } = this.state;
    let version = '';
    if (
      resourceName === 'bv.js' ||
      resourceName === 'Reviews'
    ) {
      version = text.match(/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/)
    } else {
      console.log(text)
    }

    return version;
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
      anonymous
    } = this.props;

    return (
      this.state.showResource
        ? (
          <ResourcePage
            resourceName={this.state.resourceName}
            version={this.state.version}
            selectedResource={selectedResource}
            handleClick={this.handleClick}
            resetVersion={this.resetVersion}
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