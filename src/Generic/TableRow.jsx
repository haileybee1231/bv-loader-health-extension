import React from 'react';
import StatusLight from './StatusLight.jsx';

const TableRow = props => {
  return (
    <tr>
      <td
        style={{
          whiteSpace: 'nowrap',
          width: '1%',
          paddingLeft: '4px',
          paddingRight: '4px',
        }}
      >
        {props.isResource && props.value !== 'false' ? (
          <a
            style={{ color: '#008fb2' }}
            onClick={() =>
              props.handleClick(
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
        ) : (
          props.name
        )}
        :
      </td>
      <td
        style={{
          paddingLeft: '4px',
          wordBreak: props.doNotBreak ? '' : 'break-word',
        }}
      >
        {props.value}
      </td>
      {props.isStatus && (
        <td style={{ border: '1px transparent solid', textAlign: 'center' }}>
          <StatusLight
            handleClick={() =>
              props.handleClick(
                props.name,
                props.name
                  .toLowerCase()
                  .replace(' ', '_')
                  .replace('.', '')
              )
            }
            status={props.status}
          />
        </td>
      )}
    </tr>
  );
};

export default TableRow;
