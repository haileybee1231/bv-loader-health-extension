import React from 'react';

// Used to filter analytics events.
const FilterButton = ({
  text,
  selected,
  handleClick
}) => (
  <a onClick={() => handleClick(text)}>
    {selected ? <b><em>{text}</em></b> : text}
  </a>
)

export default FilterButton;