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
    const names = Object.keys(this.props.players).map((objKey, i) => {
      const player = this.props.players[objKey];
      const lineStyle = {
        left: 5 + 'px',
        // backgroundColor: 
      }
      return <div unselectable="on" className="names" key={player.playerName} style={lineStyle} >{`${player.playerName} -`}</div>
    });

    return (
      <div className="stageTwoContainer" >
        <div className="leftPanel">
          <div className="namesHolder">
            {names}
          </div>  
          <div  className="cornerBox">
          </div>
        </div>
        <div className="rightPanel">
        <div className='courseHolder'>  
              <Course players={this.props.players}/>
        </div>
          <div className="goPanelTopContainer" onClick={this.props.incrementPosition}></div>
        </div>
        <div className="finsihLineContainer">
          <img src="https://static6.depositphotos.com/1006065/577/v/950/depositphotos_5771790-stock-illustration-checker-board.jpg" className="finishLine"></img>
        </div>
      </div>     
    )            
  }
}

export default RaceStage;