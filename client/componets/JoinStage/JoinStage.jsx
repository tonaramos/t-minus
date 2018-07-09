import React from 'react';

class JoinStage extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        name: '',
      };
    this.aliasUpdate = this.aliasUpdate.bind(this);
  
    }

    aliasUpdate (event) {
      console.log('the data at the aliasUpdate ->', event.target.value);
      this.setState({ name: event.target.value});
    }

  render() {

      return (
        <div className="textInputAreaContainer">
          <div >
            <div className="textInputArea">
              <input type="text" className="nickname" onChange={this.props.updateName} placeholder={this.props.data.namePlaceholder}/>
            </div>
          </div>
          <div className="nameBannerContainer">
            <div className="nameBanner">NAME</div>
          </div>
        </div>
    )
  }
}

export default JoinStage;