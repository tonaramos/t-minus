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
        <div>
            {`Players in room = ${this.props.data.clients}`}
          <div>
          </div>
          <form>
            <label>
              NickName:
              <input type="text" name="nickname" onChange={this.props.updateName} />
            </label>
          </form>
        </div>
    )
  }
}

export default JoinStage;