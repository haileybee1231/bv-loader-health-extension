import React from 'react';
import TableRow from './TableRow.jsx';

const ResourceList = ({ resources, toggleSection, resourcesOpen, handleClick }) => {
  const {
    bvjs,
    firebird,
    rating_summary,
    review_highlights,
    reviews,
    questions,
    inline_ratings,
    spotlights,
    bv_analytics
  } = resources;

  const resourceArr = [
    ['bv.js', bvjs],
    ['Firebird', firebird],
    ['Rating Summary', rating_summary],
    ['analytics.js', bv_analytics],
    ['Inline Ratings', inline_ratings],
    ['Reviews', reviews],
    ['Questions', questions],
    ['Review Highlights', review_highlights],
    ['Spotlights', spotlights],
    ['In Flex Pilot', window.location.href.includes('bv_segment=layouts_pilot')]
  ]

  const trueOrFalse = condition => condition ? <em>true</em> : 'false';

  return (
    <React.Fragment>
      <h2
        onClick={() => toggleSection('resources')}
        style={{ cursor: 'pointer' }}
      >
        <i className={resourcesOpen ? 'icon-chevron-up' : 'icon-chevron-down'} />
        Resources
      </h2>
      {resourcesOpen && (
        <table style={{ width: '80%', margin: 'auto' }}>
          <tbody>
            {resourceArr.map((resourceTuple, index) =>
              <TableRow
                name={resourceTuple[0]}
                value={trueOrFalse(resourceTuple[1])}
                isResource={true}
                handleClick={handleClick}
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