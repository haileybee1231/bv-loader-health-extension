import React from 'react';
import Accordion from '../Generic/Accordion.jsx';

const transformPerfMark = perfMarkObj => {
  const perfMarkArr = [];

  for (const prop in perfMarkObj) {
    perfMarkArr.push([prop, perfMarkObj[prop]]);
  }

  return perfMarkArr;
};

const PerfMarksList = props => {
  const { toggleSection, totalPerfMarks, perfMarksOpen, perfMarks } = props;

  return (
    <React.Fragment>
      <h3
        onClick={() => toggleSection('perfMarks')}
        style={{ cursor: 'pointer' }}
      >
        <i
          className={perfMarksOpen ? 'icon-chevron-up' : 'icon-chevron-down'}
        />
        bv-loader Perf Marks ({totalPerfMarks})
      </h3>
      {perfMarksOpen &&
        (totalPerfMarks ? (
          <div
            style={{
              width: '100%',
              margin: 'auto',
              maxHeight: '490px',
              overflowY: 'scroll',
            }}
          >
            {perfMarks.map((perfMark, index) => {
              const { name, entryType } = perfMark;
              const perfMarkArr = transformPerfMark(perfMark);

              return (
                <Accordion
                  name={name}
                  entryType={entryType}
                  propArr={perfMarkArr || []}
                  key={index}
                  index={index}
                />
              );
            })}
          </div>
        ) : (
          <img
            src={`${chrome.extension.getURL(
              '/assets/images/loading-spinner.svg'
            )}`}
            style={{ height: '40px' }}
          />
        ))}
    </React.Fragment>
  );
};

export default PerfMarksList;
