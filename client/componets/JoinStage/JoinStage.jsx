import React from 'react';


class JoinStage extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        name
      };
    }

  render() {

      return (
        <div>
          <div>The joinStage will be render here</div>     
          <div>
            {`Players in room = props.players/6`} {/* <-- ${this.props.players}   */}
          </div>
          <div>
            
          </div>
        </div>
    )
  }
}

export default JoinStage;