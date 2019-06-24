import React from 'react';
import TableRow from './TableRow.jsx';

class Accordion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    }
  }

  toggleAccordion = () => this.setState({
    open: !this.state.open
  });

  render() {
    const {
      cl,
      bvProduct,
      propArr,
      name,
      entryType,
      contentType
    } = this.props;

    // This component is currently pretty tightly coupled to analytic events, but it would be better
    // to be able to use them with any event or type of data we want to display. TODO: Revisit.
    return (
      <React.Fragment>
        <button
          className="accordion"
          onClick={this.toggleAccordion}
        >
          <a>
            <div>
              {this.props.index + 1}. {cl ? cl : name}: {bvProduct ? bvProduct : entryType || contentType}
            </div>
            <i className={`icon-${this.state.open ? 'minus' : 'plus'}`} style={{ float: 'right', marginTop: '-20px' }}></i>
          </a>
        </button>
        <div className="panel" style={{ display: this.state.open ? 'block' : 'none' }}>
          <table>
            <tbody>
              {propArr.map((tuple, index) => {
                const value = tuple[1];
                const isNumber = typeof value === 'number';
                if (typeof value === 'string' || isNumber) {
                  return <TableRow name={tuple[0]} value={isNumber ? value.toFixed(4) : value} key={index} />
                } else if (Array.isArray(value)) {
                  return <TableRow
                    name={tuple[0]}
                    value={
                      value
                        .map((metric, j) => `Metric ${j + 1}: ${Object.values(metric).join(', ')}`)
                        .join(',\r\n')
                    }
                    key={index}
                  />
                }
              }
              )}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    )
  }
}

export default Accordion;