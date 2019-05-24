import React from 'react';
import _cloneDeep from 'lodash/cloneDeep'
import ExtensionHeader from './ExtensionHeader.jsx';
import ExtensionBody from './ExtensionBody.jsx';
import ShadowDOM from 'react-shadow';

import { checkRequest, parseAnalyticsEvent } from './urlParsing';


class Popup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      totalAnalytics: 0,
      totalPerfMarks: 0,
      resources: {
        bvjs: null,
        firebird: null,
        prr: null,
        bv_analytics: null,
        rating_summary: null,
        review_highlights: null,
        reviews: null,
        questions: null,
        inline_ratings: null,
        spotlights: null
      },
      BV: null,
      $BV: null,
      analytics: {},
      perfMarks: null,
      firstParty: false,
      thirdParty: false,
      anonymous: false,
      selectedResource: null,
      changed: true
    };
  }

  injectScriptAndRetrieveBV = () => {
    const s = document.createElement('script');
    s.src = chrome.extension.getURL('/getBVScript.js');
    (document.head||document.documentElement).appendChild(s);
    s.onload = () => s.remove();
  }

  parseGlobalObject = ({ detail }, namespace) => {
    try {
      const parsed = JSON.parse(detail) || {};
      const resourcesCopy = _cloneDeep(this.state.resources);

      if (parsed.Internal) {
        if (!parsed.Internal.isPRR) {
          this.setState({
            resources: {
              ...resourcesCopy,
              prr: false
            }
          });
        } else {
          this.setState({
            resources: {
              ...resourcesCopy,
              firebird: false
            }
          });
        }
      }

      this.setState({
        [namespace]: parsed || 'Namespace not present.',
        changed: true
      },
        this.setState({
          changed: false
        })
      )
    }
    catch (e) {
      console.error(e);
    }
  }

  componentWillMount() {
    this.bvObjListener = document.addEventListener(
      'bv_obj_retrieved',
      bvObj => this.parseGlobalObject(bvObj, 'BV')
    );

    this.$bvObjListener = document.addEventListener(
      '$bv_obj_retrieved',
      $bvObj => this.parseGlobalObject($bvObj, '$BV')
    );


    setTimeout(() => {
      this.getNewPerfMarks();
    }, 5000);

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch(request.action) {
        case 'toggle':
          this.setState({ open: !this.state.open });
          this.injectScriptAndRetrieveBV()
          break;
        case 'capture_events':
          const {
            resource,
            analytics_event,
            firstParty,
            thirdParty,
            anonymous
          } = checkRequest(request.data.url);
          if (resource && !this.state.resources[resource]) {
            if (Array.isArray(resource)) {
              resource.forEach(possibility => {
                if (this.state.resources[possibility] === false) {
                  return;
                }

                this.setState({
                  resources: {
                    ...this.state.resources,
                    [possibility]: request.data
                  },
                  changed: true,
                }, this.setState({
                  changed: false
                }))
              })
            } else {
              this.setState({
                resources: {
                  ...this.state.resources,
                  [resource]: request.data
                },
                changed: true,
              }, this.setState({
                changed: false
              }))
            }
          } else if (analytics_event) {
            this.setState({
              analytics: {
                ...this.state.analytics,
                [analytics_event]: parseAnalyticsEvent(request.data.url)
              },
              changed: true,
              firstParty,
              thirdParty,
              anonymous
            }, this.setState({
              changed: false
            }))
            this.addAnalytic()
          }
          break;
        default:
          console.log("request: ", request)
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener(this.bvObjListener);
    document.removeEventListener(this.$bvObjListener);
  }

  getNewPerfMarks = () => {
    const perfMarkArr = performance.getEntries().filter(entry => entry.name.toLowerCase().includes('bv'));
    this.setState({
      perfMarks: perfMarkArr,
      totalPerfMarks: perfMarkArr.length
    })
  }

  addAnalytic = () => this.setState({ totalAnalytics: this.state.totalAnalytics + 1 })

  handleResourceClick = resource => {
    if (resource === 'analyticsjs') {
      resource = 'bv_analytics';
    }

    this.setState({
      selectedResource: this.state.resources[resource] || null
    })
  }

  render() {
    if (this.state.open) {
      const {
        resources,
        analytics,
        perfMarks,
        totalAnalytics,
        totalPerfMarks,
        firstParty,
        thirdParty,
        anonymous,
        selectedResource,
        changed,
        BV,
        $BV
      } = this.state;

      return (
        <ShadowDOM
          include={[
            chrome.extension.getURL("/dist/css/bvbootstrap/css/bootstrap.min.css"),
            chrome.extension.getURL("/dist/css/main.css"),
            chrome.extension.getURL("/dist/css/bvbootstrap/css/bvglyphs.css"),
            chrome.extension.getURL("/dist/css/bvbootstrap/css/font-awesome.css"),
          ]}
        >
          <div>
            {this.state.open && (
              <div id="bv_sidebar_container">
                <ExtensionHeader />
                <ExtensionBody
                  resources={resources}
                  analytics={analytics}
                  perfMarks={perfMarks}
                  totalAnalytics={totalAnalytics}
                  totalPerfMarks={totalPerfMarks}
                  firstParty={firstParty}
                  thirdParty={thirdParty}
                  anonymous={anonymous}
                  selectedResource={selectedResource}
                  BV={BV}
                  $BV={$BV}
                  changed={changed}
                  handleResourceClick={this.handleResourceClick}
                />
              </div>
            )}
          </div>
        </ShadowDOM>
        )
    } else {
      return null;
    }
  }
}

export default Popup;