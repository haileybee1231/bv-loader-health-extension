import React from 'react';
import TableRow from '../Generic/TableRow.jsx';

const FlexDetails = ({ flexDetails, resourceDetails }) => (
  <React.Fragment>
    <h3>Render</h3>
    <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
      {resourceDetails.render ? (
        resourceDetails.render
      ) : (
        <img
          src={`${chrome.extension.getURL(
            '/assets/images/loading-spinner.svg'
          )}`}
          style={{ height: '40px' }}
        />
      )}
    </div>
    <h3>Components</h3>
    <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
      {resourceDetails.components ? (
        resourceDetails.components
      ) : (
        <img
          src={`${chrome.extension.getURL(
            '/assets/images/loading-spinner.svg'
          )}`}
          style={{ height: '40px' }}
        />
      )}
    </div>
    {flexDetails &&
      flexDetails.layouts &&
      Object.keys(flexDetails.layouts).map((layout, index) => {
        const containerNodeList = document.querySelectorAll(
          `[data-bv-show="${layout}"]`
        );
        const containerObj = [...containerNodeList].map(
          container => container.dataset
        )[0];

        const containerArr = Object.entries(containerObj);
        return (
          <React.Fragment key={index}>
            <h3>Layout: {layout}</h3>
            <table>
              <tbody>
                {Object.entries(flexDetails.layouts[layout]).map(
                  (tuple, index) => (
                    <TableRow
                      name={tuple[0]}
                      value={
                        tuple[0] === '_analytics'
                          ? `bvProduct: ${tuple[1].commonData.bvProduct}, layoutId: ${tuple[1].commonData.layoutId}, locale: ${tuple[1].commonData.locale}`
                          : tuple[1]
                      }
                      key={index}
                    />
                  )
                )}
              </tbody>
            </table>
            <h4>Container</h4>
            <table>
              <tbody>
                {containerArr.map((tuple, index) => (
                  <TableRow name={tuple[0]} value={tuple[1]} key={index} />
                ))}
              </tbody>
            </table>
          </React.Fragment>
        );
      })}
  </React.Fragment>
);

export default FlexDetails;
