import React from 'react';
import Accordion from '../Generic/Accordion.jsx';
import TableRow from '../Generic/TableRow.jsx';
import _get from 'lodash/get'

const AnalyticsList = props => {
  const {
    analytics,
    totalAnalytics,
    toggleSection,
    analyticsOpen,
    anonymous,
    BVA
  } = props;
  const analyticsArr = Object.entries(analytics);

  const getCookie = cookie => _get(BVA, `trackers[bv-loader]._id.${cookie}`)

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
              <TableRow name={'First Party Cookie'} value={String(getCookie('BVID'))} />
              <TableRow name={'Third Party Cookie'} value={String(getCookie('BVSID'))} />
              <TableRow name={'Anonymous'} value={!!anonymous ? 'true' : <em>false</em>} />
            </tbody>
          </table>
          <div style={{ width: '100%', margin: 'auto' }}>
              {analyticsArr.map((analyticEventTuple, index) => {
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
              })}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default AnalyticsList;