import React from 'react';
import GoPanel from './GoPanel';

class Course extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
      };  
    }

  render() {
    const trackers = Object.keys(this.props.players).map((objKey, i) => {
      const player = this.props.players[objKey];
      //  const marLeft = player.playerPosition + 'px';
      return (
        <div className="lane">
          <div className="icon" style={{left: player.playerPosition }} key={player.playerName+i}>{`  ${player.playerName}  ${player.playerPosition}`}</div>
        </div>
      )
    });

    return (
      <div>
        <div className="innerGameBoard" >
          {trackers}
        </div>
      </div>   
    )
  }
}

export default Course;



