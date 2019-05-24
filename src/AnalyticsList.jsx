import React from 'react';
import Accordion from './Accordion.jsx';
import TableRow from './TableRow.jsx';

const transformAnalytics = analyticsObj => {
  const analyticsArr = [];

  for (const analytic in analyticsObj) {
    analyticsArr.push([analytic, analyticsObj[analytic]]);
  }

  return analyticsArr;
}

const AnalyticsList = props => {
  const {
    analytics,
    totalAnalytics,
    toggleSection,
    analyticsOpen,
    firstParty,
    thirdParty,
    anonymous
  } = props;
  const trueOrFalse = condition => condition ? <em>true</em> : 'false';
  const analyticsArr = transformAnalytics(analytics);

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
              <TableRow name={'First Party Cookie'} value={trueOrFalse(firstParty)} />
              <TableRow name={'Third Party Cookie'} value={trueOrFalse(thirdParty)} />
              <TableRow name={'Anonymous'} value={trueOrFalse(anonymous)} />
            </tbody>
          </table>
          <div style={{ width: '100%', margin: 'auto' }}>
              {analyticsArr.map((analyticEventTuple, index) => {
                const value = analyticEventTuple[1][0].__wrapped__ || analyticEventTuple[1][0];
                const propArr = transformAnalytics(value);
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