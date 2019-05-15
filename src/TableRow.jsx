import React from 'react';

const TableRow = props => {
  return (
    <tr>
      <td>
        {props.isResource && props.value !== 'false'
          ? <a
              style={{ color: '#008fb2' }}
              onClick={
                () => props.handleClick(
                  props.name,
                  props.name
                    .toLowerCase()
                    .replace(' ', '_')
                    .replace('.', '')
                )
              }
            >
              {props.name}
            </a>
          : props.name
        }:
        </td>
      <td style={{ paddingLeft: '4px', wordBreak: 'break-word' }}>{props.value}</td>
    </tr>
  )
}

export default TableRow;