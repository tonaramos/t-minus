import React from 'react';

class GoPanel extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      };  
    }

  render() {
    
    return (
      <div>
        <button onClick={this.props.incrementPosition}>GO!</button>
      </div>
    ) 
  }
}

export default GoPanel;