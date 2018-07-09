import React from 'react';
import Course from './Course';
import GoPanel from './GoPanel';

class RaceStage extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      };  
    }

  render() {
    return (
      <div>
        <div className="topPanel">
          <div className="namesHolder">
            <div>
              Names
            </div>
          </div>  
          <div className='courseHolder'>  
              <Course players={this.props.players}/>
          </div>
        </div>
        <div className="bottomPanel">
          <div>
            <GoPanel incrementPosition={this.props.incrementPosition} />
          </div>
        </div>
      </div>     
    )            
  }
}

export default RaceStage;