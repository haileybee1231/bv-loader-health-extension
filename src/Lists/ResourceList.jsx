import React from 'react';
import TableRow from '../Generic/TableRow.jsx';

const ResourceList = ({ resources, toggleSection, resourcesOpen, handleClick }) => {
  const {
    bvjs,
    firebird,
    prr,
    rating_summary,
    review_highlights,
    reviews,
    questions,
    inline_ratings,
    spotlights,
    bv_analytics,
    flex
  } = resources;

  const resourceArr = [
    ['bv.js', bvjs],
    ['Firebird', firebird],
    ['PRR', prr],
    ['Rating Summary', rating_summary],
    ['analytics.js', bv_analytics],
    ['Inline Ratings', inline_ratings],
    ['Reviews', reviews],
    ['Questions', questions],
    ['Review Highlights', review_highlights],
    ['Spotlights', spotlights],
    ['Flex', window.location.href.includes('bv_segment=layouts_pilot') ? flex : null]
  ]

  const trueOrFalse = condition => condition ? <em>true</em> : 'false';

  return (
    <React.Fragment>
      <h3
        onClick={() => toggleSection('resources')}
        style={{ cursor: 'pointer' }}
      >
        <i className={resourcesOpen ? 'icon-chevron-up' : 'icon-chevron-down'} />
        Resources
      </h3>
      {resourcesOpen && (
        <table style={{ width: '80%', margin: 'auto' }}>
          <tbody>
            <tr>
              <th>Resource</th>
              <th>On Page</th>
              <th style={{ textAlign: 'center' }}>Health</th>
            </tr>
            {resourceArr.map((resourceTuple, index) =>
              <TableRow
                name={resourceTuple[0]}
                value={trueOrFalse(resourceTuple[1])}
                isResource={true}
                handleClick={handleClick}
                isStatus={true}
                status={resourceTuple[1] ? resourceTuple[1].health : null}
                key={index}
              />
            )}
          </tbody>
        </table>
      )}
    </React.Fragment>
  )
}

export default ResourceList;