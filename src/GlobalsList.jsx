import React from 'react';
import TableRow from './TableRow.jsx';
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
    containerNodeList = document.querySelectorAll('[data-bv-show');
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
      const scriptAttrs = this.props.getBvJsScriptTag();

      const globalPath = 'global';
      const optionsPath = 'options';
      const apiConfigPath = `${optionsPath}.apiconfig`;
      const _renderPath = '_render';

      const dataEnv = _get(namespace, `${globalPath}.dataEnv`);
      const serverEnv = _get(namespace, `${globalPath}.serverEnv`);
      const siteId = _get(namespace, `${globalPath}.siteId`);

      const bvLocalKey = _get(namespace, `${apiConfigPath}.bvLocalKey`);
      const displayCode = _get(namespace, `${apiConfigPath}.displayCode`);
      const limit = _get(namespace, `${apiConfigPath}.limit`);
      const passKey = _get(namespace, `${apiConfigPath}.passKey`);

      const pixel = _get(namespace, 'pixel');
      const _render = _get(namespace, `${_renderPath}`);

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
          'Display Code': displayCode,
          Limit: limit,
          _render: !!_render,
          Pixel: !!pixel
        },
        containers,
        scriptAttrs
      });
    }

    if (namespace && resource === '$BV') {
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
      scriptAttrs
    } = this.props;

    const {
      containers,
      BV,
      $BV
    } = this.state;

    return (
      <React.Fragment>
        <h2
          onClick={() => toggleSection('globals')}
          style={{ cursor: 'pointer' }}
        >
          <i className={globalsOpen ? 'icon-chevron-up' : 'icon-chevron-down'} />
          Globals
        </h2>
        {globalsOpen && (
          <React.Fragment>
            <h4>Containers</h4>
            {containers.length ? (
              <React.Fragment>
                <table style={{ width: '80%', margin: 'auto' }}>
                  {containers.map((container, index) => {
                    const containerCopy = { ...container };
                    delete containerCopy.bvShow;
  
                    const containerArr = Object.entries(containerCopy);
  
                    return (
                      <React.Fragment key={index}>
                        <thead style={{ padding: 'auto' }}>
                          <tr>
                            <th>data-bv-show: <em>{container.bvShow}</em></th>
                          </tr>
                        </thead>
                        <tbody>
                          {containerArr.map((tuple, index) =>
                            <TableRow
                              name={tuple[0]}
                              value={tuple[1]}
                              key={index}
                            />
                          )}
                        </tbody>
                      </React.Fragment>
                    )
                  })}
                </table>
              </React.Fragment>
            ) : (
              <img
                src={`${chrome.extension.getURL('/assets/images/loading-spinner.svg')}`}
                style={{ height: '40px' }}
              />
            )}
            <h4>bv.js Script Tag</h4>
            {scriptAttrs.length ? (
              <React.Fragment>
                <table style={{ width: '80%', margin: 'auto' }}>
                  <tbody>
                  {scriptAttrs.map((tuple, index) =>
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