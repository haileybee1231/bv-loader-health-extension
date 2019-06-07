import React from 'react';
import Accordion from '../Generic/Accordion.jsx';
import TableRow from '../Generic/TableRow.jsx';
import _get from 'lodash/get'
import FilterButton from '../Generic/FilterButton.jsx';

class AnalyticsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'All'
    }
  }

  
  getCookie = cookie => _get(this.props.BVA, `trackers[bv-loader]._id.${cookie}`);

  setFilter = filter => {
    this.setState({
      filter
    })
  }
  
  render() {
    const {
      analytics,
      totalAnalytics,
      toggleSection,
      analyticsOpen,
      anonymous,
      resetAnalytics
    } = this.props;
    
    const analyticsArr = Object.entries(analytics).filter(([, analytic]) => {
      const { filter } = this.state;
      let { cl } = analytic;

      if (analytic.__wrapped__) {
        cl = analytic.__wrapped__.cl;
      }
      
      if (filter === 'All') {
        return analytic;
      } else if (filter === 'Diagnostic' || filter === 'PageView') {

        return filter === cl;
      } else {
        return (cl !== 'Diagnostic' && cl !== 'PageView')
      }
    });

    return (
      <React.Fragment>
        <h3
          onClick={() => toggleSection('analytics')}
          style={{ cursor: 'pointer' }}
        >
          <i className={analyticsOpen ? 'icon-chevron-up' : 'icon-chevron-down'} />
          Analytics Events ({totalAnalytics})
        </h3>
        {analyticsOpen && (
          <React.Fragment>
            <table style={{ width: '80%', margin: 'auto' }}>
              <tbody>
                <TableRow name={'First Party Cookie'} value={String(this.getCookie('BVID'))} />
                <TableRow name={'Third Party Cookie'} value={String(this.getCookie('BVSID'))} />
                <TableRow name={'Anonymous'} value={!!anonymous ? 'true' : <em>false</em>} />
              </tbody>
            </table>
            <h4 style={{ textAlign: 'center' }}>Filter</h4>
            <table style={{ width: '80%', margin: 'auto', textAlign: 'center' }}>
              <tbody>
                <tr>
                  {
                    ['All', 'Diagnostic', 'PageView', 'Other'].map(
                      (entry, index) =>
                        <td style={{ width: '25%' }} key={index}>
                          <FilterButton
                            text={entry}
                            selected={this.state.filter === entry}
                            handleClick={this.setFilter}
                          />
                        </td>
                    )
                  }
                </tr>
              </tbody>
            </table>
            <h4 style={{ textAlign: 'center' }}>
              <img
                style={{ width: '20px', cursor: 'pointer', display: 'inline-block' }}
                onClick={resetAnalytics}
                src={`${chrome.extension.getURL('/assets/images/refresh.png')}`}
              />
              Analytics
            </h4>
            <div style={{ width: '100%', margin: 'auto' }}>
              {analyticsArr.length ? (
                analyticsArr.map((analyticEventTuple, index) => {
                  const value = analyticEventTuple[1].__wrapped__ || analyticEventTuple[1];
                  const propArr = Object.entries(value);
                  const { cl, bvProduct, name, contentType } = value;

                  return (
                    <Accordion
                      propArr={propArr}
                      cl={cl}
                      bvProduct={bvProduct || name}
                      contentType={contentType}
                      key={index}
                      index={index}
                    />
                  )
                })
              ) : (
                <h4>No analytics events to display.</h4>
              )}
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

export default AnalyticsList;