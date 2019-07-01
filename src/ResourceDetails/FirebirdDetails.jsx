import React from 'react';
import TableRow from '../Generic/TableRow.jsx';

const FirebirdDetails = props => {
  const { env, siteId, buildTime, implementations = [] } = props;

  return (
    <React.Fragment>
      <h3>Environment</h3>
      {env}
      <h3>Site</h3>
      {siteId}
      <h3>Build Time</h3>
      {new Date(buildTime).toDateString()},{' '}
      {new Date(buildTime).toLocaleTimeString('english')}
      {implementations.length && (
        <React.Fragment>
          <h3>Implementations</h3>
          <ul>
            {implementations.map((implementation, index) => (
              <React.Fragment key={index}>
                <h4>{Object.keys(implementation)[0]}</h4>
                <table>
                  <tbody>
                    {Object.entries(
                      implementation[Object.keys(implementation)[0]]
                    ).map(
                      (tuple, index) =>
                        tuple[0] !== 'containers' && (
                          <TableRow
                            name={tuple[0]}
                            value={String(tuple[1])}
                            key={index}
                          />
                        )
                    )}
                  </tbody>
                </table>
                <h5>Containers</h5>
                <table key={index}>
                  <tbody>
                    {Object.entries(
                      implementation[Object.keys(implementation)[0]].containers
                    ).map((containerTuple, index) => (
                      <TableRow
                        name={containerTuple[0]}
                        value={containerTuple[1]}
                        key={index}
                        doNotBreak={true}
                      />
                    ))}
                  </tbody>
                </table>
              </React.Fragment>
            ))}
          </ul>
        </React.Fragment>
      )}
      {/* <h3>Script Tag</h3>
      TODO: Figure this out!
      <table>
        <tbody>
          {scriptAttrs.map((tuple, index) =>
            <TableRow name={tuple[0]} value={tuple[1]} key={index} />
          )}
        </tbody>
      </table> */}
    </React.Fragment>
  );
};

export default FirebirdDetails;
