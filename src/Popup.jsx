import React from 'react';
import _cloneDeep from 'lodash/cloneDeep'
import ExtensionHeader from './ExtensionHeader.jsx';
import ExtensionBody from './ExtensionBody.jsx';
import ShadowDOM from 'react-shadow';

import { checkRequest, parseAnalyticsEvent } from './util/urlParsing';


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
        spotlights: null,
        product_picker: null,
        flex: {
          render: null,
          components: null
        }
      },
      apps: {},
      BV: null,
      $BV: null,
      BVA: null,
      scriptInjected: false,
      analytics: {},
      perfMarks: null,
      anonymous: false,
      selectedResource: null,
      changed: true
    };
  }

  injectScriptAndRetrieveBV = () => {
    const s = document.createElement('script');
    s.src = chrome.extension.getURL('/getBVScript.js');
    (document.head||document.documentElement).appendChild(s);
    this.setState({
      scriptInjected: true
    });
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
              prr: false,
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

      if (namespace === 'BV') {
        this.parseApps(parsed)
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  parseApps = BV => {
    const apps = [
      'inline_ratings',
      'questions',
      'rating_summary',
      'review_highlights',
      'reviews',
      'seller_ratings',
      'spotlights',
      'product_picker'
    ];

    apps.forEach(app => {
      if (BV[app]) {
        this.setState({
          apps: {
            ...this.state.apps,
            [app]: {
              ...BV[app]
            }
          }
        })
      }
    })
  }

  componentDidMount() {
    this.bvObjListener = document.addEventListener(
      'bv_obj_retrieved',
      bvObj => this.parseGlobalObject(bvObj, 'BV')
    );

    this.$bvObjListener = document.addEventListener(
      '$bv_obj_retrieved',
      $bvObj => {
        this.parseGlobalObject($bvObj, '$BV')
      }
    );

    this.bvaObjListener = document.addEventListener(
      'bva_obj_retrieved',
      bvaObj => {
        this.parseGlobalObject(bvaObj, 'BVA')
      }
    )

    setTimeout(() => {
      this.getNewPerfMarks();
    }, 5000);

    this.chromeEventListener = chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch(request.action) {
        case 'toggle':
          this.setState({ open: !this.state.open });
          if (!this.state.scriptInjected) {
            this.injectScriptAndRetrieveBV()
          }
          break;
        case 'capture_events':
          let {
            resource,
            analytics_event,
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
            } else if (resource === 'render' || resource === 'components') {
              this.setState({
                resources: {
                  ...this.state.resources,
                  flex: {
                    ...this.state.resources.flex,
                    [resource]: request.data
                  }
                },
                changed: true,
              }, () =>
                setTimeout(
                  () => this.setState({
                    changed: false
                  }),
                  500
                )
              );
            } else {
              this.setState({
                resources: {
                  ...this.state.resources,
                  [resource]: request.data
                },
                changed: true,
              }, () =>
                setTimeout(
                  () => this.setState({
                    changed: false
                  }),
                  500
                )
              );
            }
          } else if (analytics_event) {
            const parsedEvent = parseAnalyticsEvent(request.data.url);
            
            const setAnalyticEvent = event => {
              let analytics_event_copy = analytics_event;

              const tickUpDupeNumber = potentialDupe => {
                const eventInState = this.state.analytics[potentialDupe];
                if (eventInState) {
                  const dupeNumber = potentialDupe.match(/\(([0-9]*)\)/) ? potentialDupe.match(/\(([0-9]*)\)/)[1] : 0;
                  return tickUpDupeNumber(`${analytics_event_copy}(${+dupeNumber + 1})`);
                } else {
                  return potentialDupe;
                }
              }

              analytics_event_copy = tickUpDupeNumber(analytics_event_copy);

              this.setState({
                analytics: {
                  ...this.state.analytics,
                  [analytics_event_copy]: event
                },
                changed: true,
                anonymous
              }, this.setState({
                changed: false
              }))
              this.addAnalytic()
            }

            if (Array.isArray(parsedEvent)) {
              parsedEvent.forEach(event => setAnalyticEvent(event));
            } else {
              setAnalyticEvent(parsedEvent);
            }
            
          }
          break;
        default:
          console.log("request: ", request)
      }
    });

    chrome.runtime.sendMessage({ type: 'bv-loader-extension-mounted' });
  }

  componentWillUnmount() {
    document.removeEventListener('bv_obj_retrieved', this.bvObjListener);
    document.removeEventListener('$bv_obj_retrieved', this.$bvObjListener);
    chrome.runtime.removeEventListener(this.chromeEventListener);
  }

  getNewPerfMarks = () => {
    const perfMarkArr = performance.getEntries().filter(entry => entry.name.toLowerCase().includes('bv'));
    this.setState({
      perfMarks: perfMarkArr,
      totalPerfMarks: perfMarkArr.length
    })
  }

  addAnalytic = () => this.setState({ totalAnalytics: this.state.totalAnalytics + 1 })

  resetAnalytics = () => this.setState({
    analytics: {},
    totalAnalytics: 0
  })

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
        apps,
        perfMarks,
        totalAnalytics,
        totalPerfMarks,
        anonymous,
        selectedResource,
        changed,
        BV,
        $BV,
        BVA
      } = this.state;

      return (
        <ShadowDOM
          include={[
            chrome.extension.getURL("/dist/css/bvbootstrap/css/clean-slate.css"),
            chrome.extension.getURL("/dist/css/bvbootstrap/css/bootstrap.min.css"),
            chrome.extension.getURL("/dist/css/main.css"),
            chrome.extension.getURL("/dist/css/bvbootstrap/css/bvglyphs.css"),
            chrome.extension.getURL("/dist/css/bvbootstrap/css/font-awesome.css"),
          ]}
        >
          <div className="bv-cleanslate">
            {this.state.open && (
              <div id="bv_sidebar_container">
                <ExtensionHeader />
                {this.state.resources.bvjs ? (
                  <ExtensionBody
                    resources={resources}
                    apps={apps}
                    analytics={analytics}
                    perfMarks={perfMarks}
                    totalAnalytics={totalAnalytics}
                    totalPerfMarks={totalPerfMarks}
                    anonymous={anonymous}
                    selectedResource={selectedResource}
                    BV={BV}
                    $BV={$BV}
                    BVA={BVA}
                    changed={changed}
                    handleResourceClick={this.handleResourceClick}
                    resetAnalytics={this.resetAnalytics}
                  />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <h3>
                      bv-loader not detected.
                    </h3>
                  </div>
                )
              }
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