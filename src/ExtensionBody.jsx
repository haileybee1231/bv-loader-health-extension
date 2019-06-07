import React from 'react';
import ResourcePage from './ResourceDetails/ResourcePage.jsx';
import ResourceList from './Lists/ResourceList.jsx';
import AnalyticsList from './Lists/AnalyticsList.jsx';
import PerfMarksList from './Lists/PerfMarksList.jsx';
import GlobalsList from './Lists/GlobalsList.jsx';

class ExtensionBody extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showResource: false,
      resourceName: '',
      version: '',
      resourceDetails: {},
      resourceHealth: {},
      flexDetails: null,
      analyticsDetails: null,
      resourcesOpen: false,
      globalsOpen: false,
      perfMarksOpen: false,
      analyticsOpen: false,
      bvJsScriptAttrs: []
    };

    this.appMap = {
      'Inline Ratings': 'inline_ratings',
      'Questions': 'questions',
      'Rating Summary': 'rating_summary',
      'Review Highlights': 'review_highlights',
      'Reviews': 'reviews',
      'Seller Ratings': 'seller_ratings',
      'Spotlights': 'spotlights',
      'Product Picker': 'product_picker',

      'inline_ratings': 'Inline Ratings',
      'questions': 'Questions',
      'rating_summary': 'Rating Summary',
      'review_highlights': 'Review Highlights',
      'reviews': 'Reviews',
      'seller_ratings': 'Seller Ratings',
      'spotlights': 'Spotlights',
      'product_picker': 'Product Picker',
    };
  }

  componentWillReceiveProps({ selectedResource }) {
    if (selectedResource && !this.state.version) {
      if (selectedResource.render) {
        this.getVersions(
          Object.entries(selectedResource)
            .filter(([resource,]) => resource !== 'health')
            .map(([resource, details]) => details.url.replace('.min', ''))
        );
      } else {
        this.getVersion(selectedResource.url);
      }
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
    });
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

  getVersions = urls => {
    Promise.all(
      urls.map(
        url => fetch(url)
      )
    )
      .then(responses => Promise.all(responses.map(res => res.text() )))
        .then(texts => {
          this.setState({
            resourceDetails: {
              render: texts[0],
              components: texts[1],
              health: this.props.resources.flex.health
            },
            version: 'retrieved'
          })
        })
  }

  parseResponse = text => {
    const { resourceName } = this.state;
    const alias =
      resourceName === 'analytics.js'
        ? 'bv_analytics'
        : resourceName.toLowerCase().replace('.', '').replace(' ', '_');
    const resourceDetails = {
      health: this.props.resources[alias].health
    };

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
    } else if (resourceName === 'analytics.js') {
      resourceDetails.version = text.match(/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/)
    } else {
      resourceDetails.version = text.match(/[0-9]{1,2}\.[0-9]{1,2}\.[0-9]{1,2}/);
    }

    return resourceDetails;
  }

  getAnalyticsDetails = analyticsDetails => {
    if (!this.state.analyticsDetails) {
      this.setState({
        analyticsDetails
      })
    }
  }

  getFlexDetails = flexDetails => {
    if (!this.state.flexDetails) {
      this.setState({
        flexDetails
      })
    }
  }

  assessHealth = (name, details) => {
    // We initialize health status at 2, which is green (yellow is 1, red is 0),
    //and ding appropriately based on relevant conditions
    const health = {
      score: 2
    };
    let numOfIssues = 0;

    const updateHealth = (score, issue) => {
      health.score = score;
      health[issue] = true;
      numOfIssues++;
    }

    if (name === 'bvjs') {
      const { bvJsScriptAttrs: scriptAttrs } = this.state;
      if (!scriptAttrs.length) {
        updateHealth(0, 'Missing Script Tag');
      } else {
        scriptAttrs.forEach(tuple => {
          if (tuple[0] === 'async' && (!tuple[1] || tuple[1] === 'false')) {
            updateHealth(1, 'Async Not Enabled on Script Tag');
          } else if (tuple[0] === 'defer' && (!tuple[1] || tuple[1] === 'false')) {
            updateHealth(1, 'Defer Not Enabled on Script Tag');
          } else if (tuple[0] === 'src' && (!tuple[1])) {
            updateHealth(0, 'src Missing on Script Tag');
          }
        });
      }

      const { BV } = this.props;

      if (!BV) {
        updateHealth(0, 'BV Namespace Is Missing');
      } else {
        const { global } = BV;

        if (!global) {
          updateHealth(1, 'BV.global Namespace Is Missing');
        } else {
          if (!global.dataEnv) {
            updateHealth(1, 'Data Environment Is Missing from BV Global');
          }
          if (!global.serverEnv) {
            updateHealth(1, 'Server Environment Is Missing from BV Global');
          }
          if (!global.locale) {
            updateHealth(1, 'Locale Is Missing from BV Global');
          }
          if (!global.client) {
            updateHealth(1, 'Client Is Missing from BV Global');
          }
          if (!global.siteId) {
            updateHealth(1, 'SiteId Is Missing from BV Global');
          }
        }
      }
    } else if(name === 'firebird') {
      // ¯\_(ツ)_/¯
    } else if (name === 'prr') {
      const { $BV } = this.props;

      if (!$BV) {
        updateHealth(0, '$BV Namespace Is Missing');
      } else {
        const { Internal } = $BV;

        if (!Internal) {
          updateHealth(0, '$BV.Internal Namespace Is Missing')
        }
      }

      // ¯\_(ツ)_/¯
    } else if (name === 'bv_analytics') { 
      const { BVA } = this.props;

      if (!BVA) {
        updateHealth(0, 'BVA Namespace Is Missing');
      } else {
        if (!BVA.loadId) {
          updateHealth(1, 'No loadId Assigned');
        }

        const { trackers } = BVA;


        for (const tracker in trackers) {
          const { _settings, _id, _shared } = trackers[tracker];

          if (!_settings) {
            updateHealth(1, `No Settings Configured for ${tracker} Tracker`);
          }

          if (tracker !== 'default') {
            if (!_id) {
              updateHealth(1, `No ID Object Configured for ${tracker} Tracker`);
            } else {
              if (!_id.hostname) {
                updateHealth(1, `No Hostname Configured for ${tracker} Tracker`);
              }
  
              if (!_settings.anonymous && (!_id.BVID && !_id.BVSID)) {
                updateHealth(1, `${tracker} Tracker Not Set to Anonymous, But No Cookies Assigned`);
              } else if (_settings.anonymous && (_id.BVID || _id.BVSID)) {
                updateHealth(1, `${tracker} Tracker Set to Anonymous, But Cookies Are Assigned`);
              }
            }

            if (!_shared) {
              updateHealth(1, `No Shared Settings Configured for ${tracker} Tracker`);
            } else {
              if (!_shared.client) {
                updateHealth(1, `No Client Set for ${tracker} Tracker`);
              }
  
              if (!_shared.loadId) {
                updateHealth(1, `No loadId Set for ${tracker} Tracker`);
              }
            }
          }
        }
      }

    } else if (this.appMap[name]) {

      const container = document.querySelectorAll(`[data-bv-show="${
        name === 'inline_ratings' ? 'inline_rating' : name
      }"`)[0];

      const namespace = this.props.BV ? this.props.BV[name] : null;

      // App won't render if container or namespace isn't there
      if (!container) {
        updateHealth(0, `data-bv-show=${name} Container Missing`);
      }
      if (!namespace) {
        updateHealth(0, `${name} Missing from Global`);
      }

      if (container && namespace) {
        if (!container.dataset[name === 'spotlights' ? 'bvSubjectId' : 'bvProductId']) {
          if (!container.dataset.bvProductId && container.dataset.bvProductid) {
            updateHealth(1, 'Potentially Wrong bvProductId Casing')
          } else {
            updateHealth(1, `${name === 'spotlights' ? 'bvSubjectId' : 'bvProductId'} Missing`);
          }
        }
        
        if (!namespace.config[name === 'spotlights' ? 'cloudKey' : 'apiKey']) {
          if (['reviews', 'questions'].indexOf(name) === -1) {
            updateHealth(1, `${name === 'spotlights' ? 'API Key' : 'Cloud Key'} Missing from Config`);
          }
        }
        
        if (!namespace._analytics) {
          updateHealth(1, `Analytings Missing from ${name} Global`);
        }
      }
    } else if (name === 'flex') {
      const { BV } = this.props;

      if (!BV) {
        updateHealth(0, 'BV Namespace Is Missing');
      } else {
        const { _render } = this.props.BV;
        
        if (!_render) {
          updateHealth(0, 'No _render Namespace on BV Global');
        } else {
          const { layouts, perfMark } = _render;
          if (!layouts || !Object.entries(layouts).length) {
            updateHealth(1, 'No layouts registered');
          } else {
            for (const layout in layouts) {
              if (!layouts[layout]) {
                updateHealth(1, `No Analytics Object on Layout "${layout}"`);
              }
            }
          }
  
          if (!perfMark) {
            updateHealth(1, 'No _render PerfMark registered')
          }
        }
      }
    }

    if (numOfIssues > 3) {
      health.score--;
    }

    if (health.score < 0) {
      health.score = 0;
    }

    return health;
  }

  render() {
    const {
      resources,
      analytics,
      perfMarks,
      apps,
      changed,
      totalAnalytics,
      totalPerfMarks,
      selectedResource,
      anonymous,
      BV,
      $BV,
      BVA,
      resetAnalytics
    } = this.props;

    for (const resource in resources) {
      if (resources[resource]) {
        resources[resource].health = this.assessHealth(resource, resources[resource]);
      }
    }

    return (
      this.state.showResource
        ? (
          <ResourcePage
            resourceName={this.state.resourceName}
            resourceDetails={this.state.resourceDetails}
            appDetails={
              this.appMap[this.state.resourceName]
                ? apps[this.appMap[this.state.resourceName]]
                : null
            }
            BVA={BVA}
            analyticsDetails={this.state.analyticsDetails}
            flexDetails={this.state.flexDetails}
            selectedResource={selectedResource}
            handleClick={this.handleClick}
            resetVersion={this.resetVersion}
            bvJsScriptAttrs={this.state.bvJsScriptAttrs}
            getBvJsScriptTag={this.getBvJsScriptTag}
          />
        ) : (
          <div style={{ paddingLeft: '20px', paddingBottom: '20px' }}>
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
              BVA={BVA}
              getBvJsScriptTag={this.getBvJsScriptTag}
              bvJsScriptAttrs={this.state.bvJsScriptAttrs}
              getAnalyticsDetails={this.getAnalyticsDetails}
              getFlexDetails={this.getFlexDetails}
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
              anonymous={anonymous}
              changed={changed}
              BVA={BVA}
              resetAnalytics={resetAnalytics}
            />
          </div>
        )
    )
  }
}

export default ExtensionBody;