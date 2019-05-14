import React from 'react';

const ResourceList = (props) => {
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
  } = props.resources;

  const trueOrFalse = condition => condition ? <em>true</em> : 'false'

  return (
    <table style={{ width: '80%', margin: 'auto' }}>
      <tr>
        <td>bv.js:</td>
        <td>{trueOrFalse(bvjs)}</td>
      </tr>
      <tr>
        <td>Firebird:</td>
        <td>{trueOrFalse(firebird)}</td>
      </tr>
      <tr>
        <td>bv_analytics:</td>
        <td>{trueOrFalse(bv_analytics)}</td>
      </tr>
      <tr>
        <td>Rating Summary:</td>
        <td>{trueOrFalse(rating_summary)}</td>
      </tr>
      <tr>
        <td>Review Highlights:</td>
        <td>{trueOrFalse(review_highlights)}</td>
      </tr>
      <tr>
        <td>Reviews:</td>
        <td>{trueOrFalse(reviews)}</td>
      </tr>
      <tr>
        <td>Questions:</td>
        <td>{trueOrFalse(questions)}</td>
      </tr>
      <tr>
        <td>Inline Ratings:</td>
        <td>{trueOrFalse(inline_ratings)}</td>
      </tr>
      <tr>
        <td>Spotlights:</td>
        <td>{trueOrFalse(spotlights)}</td>
      </tr>
      <tr>
        <td>In Flex Pilot:</td>
        <td>{trueOrFalse(window.location.href.includes('bv_segment=layouts_pilot'))}</td>
      </tr>
    </table>
  )
}

export default ResourceList;