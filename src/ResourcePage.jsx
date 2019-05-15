import React from 'react';

class ResourcePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    const {
      handleClick,
      resourceName,
      version,
      resetVersion,
      selectedResource
    } = this.props;
    console.log(selectedResource);
    return (
      <div style={{ paddingLeft: '10px', paddingTop: '10px' }}>
        <a
          onClick={() => {
            resetVersion();
            handleClick(null);
          }}
        ><i className='icon-arrow-left'></i></a>
        <div className="inline-headers">
          <h1 style={{ marginRight: '4px' }}>{resourceName}</h1>
          <em>{`${version ? 'v' : 'Resource not found.'}${version}`}</em>
        </div>
        <div>
          <table>
            <tbody>

            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default ResourcePage;
