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
      <div className="stageTwoContainer" >
        <div className="leftPanel">
          <div className="namesHolder">
            <div>
              Names
            </div>
          </div>  
        </div>
        <div className="rightPanel">
        <div className='courseHolder'>  
              <Course players={this.props.players}/>
        </div>
          <div class="goPanelTopContainer" onClick={this.props.incrementPosition}></div>
        </div>
      </div>     
    )            
  }
}

export default RaceStage;