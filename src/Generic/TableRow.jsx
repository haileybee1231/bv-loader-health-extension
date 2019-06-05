import React from 'react';

const TableRow = props => {
  return (
    <tr>
      <td
        style={{
          whiteSpace: 'nowrap',
          width: '1%',
          paddingLeft: '4px',
          paddingRight: '4px'
        }}
      >
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
      <td style={{ paddingLeft: '4px', wordBreak: props.doNotBreak ? '' : 'break-word' }}>{props.value}</td>
    </tr>
  )
}

export default TableRow;