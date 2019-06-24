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

  // Since Chrome extensions can't directly read global variables from the window
  // object (they have their own window), we wait until a user opens the extension
  // to inject a script and get the global objects.
  injectScriptAndRetrieveBV = () => {
    const s = document.createElement('script');
    s.src = chrome.extension.getURL('dist/getBVScript.js');
    (document.head||document.documentElement).appendChild(s);
    // Mark that script has been injected so it doesn't happen multiple times
    this.setState({
      scriptInjected: true
    });
    // Clean up script after invocation
    s.onload = () => s.remove();
  }

  // When we receive a global object from the injected script, we need to parse it
  parseGlobalObject = ({ detail }, namespace) => {
     try {
      const parsed = JSON.parse(detail) || {};
      // In testing, it seems like Firebird/PRR sometimes load slower, and analytics
      // slower than that, and we need to give the older namespaces time to be created,
      // so the script gets BV, $BV, and BVA in sequence. As a result, there can be some
      // funniness as to whether we've actually retrieved Firebird/PRR, and explicitly
      // setting them to false and keeping the rest of the resources intact gets around that
      // issue.
      const resourcesCopy = _cloneDeep(this.state.resources);

      if (parsed.Internal) {
        // If this is true, we know for a fact we don't have PRR and can disable Firebird
        if (parsed.Internal.isPRR) {
          this.setState({
            resources: {
              ...resourcesCopy,
              firebird: false
            }
          });
          
        } else {
          // If Internal is defined and it's NOT PRR, we know we have Firebird
          this.setState({
            resources: {
              ...resourcesCopy,
              prr: false,
            }
          });
        }
      }

      // Regardless of which namespace, set it on the state object
      this.setState({
        [namespace]: parsed || 'Namespace not present.',
        changed: true
      },
        // Several times throughout this repo we utilize the "changed" prop to force
        // children to rerender even when nested objects are passed through state
        this.setState({
          changed: false
        })
      )

      if (namespace === 'BV') {
        // If we're given the BV namespace, we also have a bunch of apps registered to
        // the namespace
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
    // When the extension mounts, we add event listeners so that the injected script
    // can signal that it's retrieved the global namespaces from the window object
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

    // This 5 second timer is arbitrary, but we just want to collect all the perf marks
    // TODO: Add functionality to query for more perf marks after the intiial retrieval,
    // in case we don't get all of them.
    setTimeout(() => {
      this.getNewPerfMarks();
    }, 5000);

    // This listener monitors the chrome runtime for messages which will correlate to resource
    // requests intercepted by the webRequest API
    this.chromeEventListener = chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch(request.action) {
        case 'toggle':
          this.setState({ open: !this.state.open });
          // To prevent the extension from gumming up page loads, don't inject the script
          // to harvest namespaces until the user has toggled it, and only do so once.
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
            // The only time we return an array for the resource variable is when the resource
            // is bvapi.js, which could ambiguously be either Firebird or PRR
            if (Array.isArray(resource)) {
              resource.forEach(possibility => {
                // If the script has been injected and we've already determined that a resource is
                // definitely not Firebird or PRR, it will be equal to "false" instead of "null", so
                // we'll only set the appropriate possibility
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
                }));
              });
            } else if (resource === 'render' || resource === 'components') {
              // In the case of flex layouts, render and components aren't correlated directly
              // to how we discover if a client is in the flex pilot, so watch for render and components.
              this.setState({
                resources: {
                  ...this.state.resources,
                  flex: {
                    ...this.state.resources.flex,
                    [resource]: request.data
                  }
                },
                changed: true,
              }, this.setState({
                changed: false
              }));
            } else {
              this.setState({
                resources: {
                  ...this.state.resources,
                  [resource]: request.data
                },
                changed: true,
              }, this.setState({
                changed: false
              }));
            }
          } else if (analytics_event) {
            const parsedEvent = parseAnalyticsEvent(request.data.url);
            
            const setAnalyticEvent = event => {
              let analytics_event_copy = analytics_event;

              // If we receive an analytics event, there's a possibility it's batched, and we need to track each
              // individual member of a batch separately, so we use an event, event(1), event(2) system to track.
              // This needs to be done recursively, becaus we don't know how many matches there may be.
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
              }));
              // Tick up the total number of registered analytics
              this.addAnalytic();
            }

            // If we receive a batch of events, handle each individually
            if (Array.isArray(parsedEvent)) {
              parsedEvent.forEach(event => setAnalyticEvent(event));
            } else {
              // Otherwise just set it directly.
              setAnalyticEvent(parsedEvent);
            }
            
          }
          break;
        default:
          console.log("request: ", request)
      }
    });

    // Send a message to the background script that the extension is loaded onto the DOM.
    chrome.runtime.sendMessage({ type: 'bv-loader-extension-mounted' });
  }

  componentWillUnmount() {
    // I actually don't think we need any of these, because it seems that componentWillUnmount
    // does't actually fire like it's supposed to in this context, but I can't find proof that that's
    // how it's supposed to be so I'm leaving it for now.
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

  // If a user clicks on the name of a resource, we toggle the view entirely
  handleResourceClick = resource => {
    // This is just to maintain parity between the way this resource is named in a few places
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

      // The `chrome.extension.getURL` function is necessary to get the resource relative to
      // the variable extension root.
      const getUrl = url => chrome.extension.getURL(url);

      return (
        // The app is registered inside of a ShadowDOM Root to prevent CSS pollution, and
        // we also inject our CSS stylesheets here. 
        <ShadowDOM
          include={[
            getUrl("/dist/css/bvbootstrap/css/reset.css"),
            getUrl("/dist/css/bvbootstrap/css/bootstrap.min.css"),
            getUrl("/dist/css/main.css"),
            getUrl("/dist/css/bvbootstrap/css/bvglyphs.css"),
            getUrl("/dist/css/bvbootstrap/css/font-awesome.css"),
          ]}
        >
          <div>
            {this.state.open && (
              <div id="bv_sidebar_container">
                <ExtensionHeader />
                {/* TODO: Rethink this, right now the extension only shows info if bv.js is
                on the page but we should at least minimally show analytics regardless of if
                that's the case */}
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