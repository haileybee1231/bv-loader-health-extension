import React from 'react';
import TableRow from '../Generic/TableRow.jsx';
import _get from 'lodash/get'

class GlobalsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      BV: null,
      $BV: null,
      containers: []
    }
  }

  componentDidMount() {
    this.pollForContainers(500);
  }

  componentWillReceiveProps({ $BV }) {
    if (!this.state.$BV && $BV) {
      this.setGlobalsState('$BV');
    }
  }

  pollForContainers = (interval, containerNodeList) => {
    containerNodeList = document.querySelectorAll('[data-bv-show]');
    if (containerNodeList.length && this.props.BV) {
      this.setGlobalsState('BV', containerNodeList);
    } else {
      setTimeout(() => this.pollForContainers(interval, containerNodeList), interval)
    }
  }

  setGlobalsState = (resource, containerNodeList = this.state.containers) => {
    const containers = [...containerNodeList]
        .map(container => container.dataset);

    const { [resource]: namespace } = this.props;

    if (namespace && resource === 'BV') {
      const bvJsScriptAttrs = this.props.getBvJsScriptTag();

      const getProp = path => _get(namespace, path);

      const globalPath = 'global';
      const optionsPath = 'options';
      const apiConfigPath = `${optionsPath}.apiconfig`;
      const _renderPath = '_render';

      const dataEnv = getProp(`${globalPath}.dataEnv`);
      const serverEnv = getProp(`${globalPath}.serverEnv`);
      const siteId = getProp(`${globalPath}.siteId`);

      const bvLocalKey = getProp(`${apiConfigPath}.bvLocalKey`);
      const displayCode = getProp(`${apiConfigPath}.displayCode`);
      const limit = getProp(`${apiConfigPath}.limit`);
      const passKey = getProp(`${apiConfigPath}.passKey`);

      const pixel = getProp('pixel');
      const _render = getProp(`${_renderPath}`);

      const analyticsVendors = getProp(`${optionsPath}.analytics.vendors`);
      const bvLocal = getProp(`${optionsPath}.bvLocal.enabled`);
      const deploymentPath = getProp(`${optionsPath}.deploymentPath`);
      const deploymentVersion = getProp(`${optionsPath}.deploymentVersion`);
      const fingerprintingEnabled = getProp(`${optionsPath}.fingerprintingEnabled`);
      const pageSize = getProp(`${optionsPath}.page.size`);
      const sci = getProp(`${optionsPath}.sci.enabled`);
      const trackingDataRegion = getProp(`${optionsPath}.trackingDataRegion`);

      if (typeof namespace === 'string') {
        this.setState({ [resource]: namespace });
        return;
      }

      this.setState({
        BV: { 
          'Data Environment': dataEnv,
          'Server Environment': serverEnv,
          'Site ID': siteId,
          'API KEY': passKey,
          'BV Local Key': bvLocalKey,
          'BV Local Enabled': String(!!bvLocal),
          'Display Code': displayCode,
          Limit: limit,
          _render: !!_render,
          Pixel: !!pixel,
          'Deployment Path': deploymentPath,
          'Deployment Version': deploymentVersion,
          'Fingerprinting Enabled': String(!!fingerprintingEnabled),
          'Page Size': pageSize,
          'SCI Trackers Enabled': sci,
          'Analytics Vendors': analyticsVendors ? Object.keys(analyticsVendors).join(', ') : false,
          'Tracking Data Region': trackingDataRegion
        },
        containers,
        bvJsScriptAttrs
      });

      this.props.getAnalyticsDetails({
        pixel: !!pixel,
        fingerprintingEnabled: !!fingerprintingEnabled,
        sci: !!sci,
        analyticsVendors,
        trackingDataRegion
      });

      this.props.getFlexDetails({
        layouts: _render.layouts
      });
    } else if (namespace && resource === '$BV') {
      const InternalPath = 'Internal';
      const _magpieSettingsPath = '_magpieSettings';

      const isPRR = _get(namespace, `${InternalPath}.isPRR`);
      const _baseUrl = _get(namespace, `${InternalPath}._baseUrl`);

      const anonymous = _get(namespace, `${_magpieSettingsPath}.anonymous`);
      const autoTagEnabled = _get(namespace, `${_magpieSettingsPath}.autoTagEnabled`);
      const brandDomain = _get(namespace, `${_magpieSettingsPath}.brandDomain`);
      const isEU = _get(namespace, `${_magpieSettingsPath}.isEU`);

      if (typeof namespace === 'string') {
        this.setState({ [resource]: namespace });
        return;
      }

      this.setState({
        $BV: { 
          'Is PRR': isPRR || 'false',
          'Base URL': _baseUrl || '""',
          Anonymous: anonymous || 'false',
          'Auto-Tag Enabled': autoTagEnabled || 'false',
          'Brand Domain': brandDomain,
          'Is EU': String(!!isEU)
        }
      });
    }
  }

  render() {
    const {
      globalsOpen,
      toggleSection,
      bvJsScriptAttrs
    } = this.props;

    const {
      containers,
      BV,
      $BV
    } = this.state;

    return (
      <React.Fragment>
        <h3
          onClick={() => toggleSection('globals')}
          style={{ cursor: 'pointer' }}
        >
          <i className={globalsOpen ? 'icon-chevron-up' : 'icon-chevron-down'} />
          Globals
        </h3>
        {globalsOpen && (
          <React.Fragment>
            <h4>Containers</h4>
            {containers.length ? (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {containers.map((container, index) => {
                  const containerCopy = { ...container };
                  delete containerCopy.bvShow;

                  const containerArr = Object.entries(containerCopy);

                  return (
                    <div key={index} style={{ width: '80%', margin: 'auto' }}>
                      <b style={{ fontFamily: 'GibsonRegular,Helvetica,Arial,sans-serif', fontSize: '14px' }}>data-bv-show: <em>{container.bvShow}</em></b>
                      <table>
                        <tbody>
                          {containerArr.map((tuple, index) =>
                            <TableRow
                              name={tuple[0]}
                              value={tuple[1]}
                              key={index}
                            />
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                })}
              </div>
            ) : (
              <img
                src={`${chrome.extension.getURL('/assets/images/loading-spinner.svg')}`}
                style={{ height: '40px' }}
              />
            )}
            <h4>bv.js Script Tag</h4>
            {bvJsScriptAttrs.length ? (
              <React.Fragment>
                <table style={{ width: '80%', margin: 'auto' }}>
                  <tbody>
                  {bvJsScriptAttrs.map((tuple, index) =>
                    <TableRow
                      name={tuple[0]}
                      value={tuple[1]}
                      key={index}
                    />
                  )}
                  </tbody>
                </table>
              </React.Fragment>
            ) : (
              <img
                src={`${chrome.extension.getURL('/assets/images/loading-spinner.svg')}`}
                style={{ height: '40px' }}
              />
            )}
            <h4>Global BV Namespace</h4>
            {BV ? (
              <React.Fragment>
                <table style={{ width: '80%', margin: 'auto' }}>
                  <tbody>
                  {Object.entries(BV).map((tuple, index) =>
                    tuple[1] && <TableRow
                      name={tuple[0]}
                      value={String(tuple[1])}
                      key={index}
                    />
                  )}
                  </tbody>
                </table>
              </React.Fragment>
            ) : (
              <img
                src={`${chrome.extension.getURL('/assets/images/loading-spinner.svg')}`}
                style={{ height: '40px' }}
              />
            )}
            <h4>Global $BV Namespace</h4>
            {$BV ? (
              <React.Fragment>
                <table style={{ width: '80%', margin: 'auto' }}>
                  <tbody>
                  {Object.entries($BV).map((tuple, index) =>
                    tuple[1] && <TableRow
                      name={tuple[0]}
                      value={String(tuple[1])}
                      key={index}
                    />
                  )}
                  </tbody>
                </table>
              </React.Fragment>
            ) : (
              <img
                src={`${chrome.extension.getURL('/assets/images/loading-spinner.svg')}`}
                style={{ height: '40px' }}
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

export default GlobalsList;