import React from 'react';
import { createPortal } from 'react-dom';
import ExtensionHeader from './ExtensionHeader.jsx';
import ExtensionBody from './ExtensionBody.jsx';

import { checkRequest, parseAnalyticsEvent } from './urlParsing';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      numNewEvents: 0,
      resources: {
        bvjs: false,
        firebird: false,
        bv_analytics: false,
        rating_summary: false,
        review_highlights: false,
        reviews: false,
        questions: false,
        inline_ratings: false,
        spotlights: false
      },
      analytics: {

      },
      changed: true
    };

    this.root = document.getElementById('bv-loader-health-extension-root');
    this.el = document.createElement('div')
    this.el.id = 'bv_sidebar_container'
  }

  componentDidMount() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch(request.action) {
        case 'toggle':
          this.setState({ open: !this.state.open });
          break;
        case 'capture_events':
          const { resource, analytics_event } = checkRequest(request.data);
          if (resource) {
            this.setState({
              resources: {
                ...this.state.resources,
                [resource]: true
              },
              changed: true,
            }, this.setState({
              changed: false
            }))
          } else if (analytics_event) {
            console.log('************', parseAnalyticsEvent(request.data))
            this.setState({
              analytics: {
                ...this.state.analytics,
                [analytics_event]: parseAnalyticsEvent(request.data)
              },
              changed: true,
            }, this.setState({
              changed: false
            }))
          }
          break;
        default:
          console.log("request: ", request)
      }
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.open !== nextState.open && !nextState.open) {
      this.root.removeChild(this.el)
    }
  }

  render() {
    if (this.state.open) {
      this.root.appendChild(this.el)

      return createPortal(
        <React.Fragment>
          <ExtensionHeader />,
          <ExtensionBody
            resources={this.state.resources}
            changed={this.state.changed}
          />
        </React.Fragment>,
        this.el
      )
    } else {
      return null;
    }
  }
}

export default App;