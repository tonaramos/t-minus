import React from 'react';
import '../main.css';

import JoinStage from './JoinStage/JoinStage';

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        stage: 0,
        playerName: 'test',
        playerPosition: 250,
        playerSpeed: 25
      };
    }
  /*
  STATE {
    stage: 0,
    players: { 
      one:{
        name:
        atributes:
        icon:
      },
      two: {
        name:
        atributes:
        icon
      }
    }

  }
  */




  timeHandler(milseconds) {  // the argument to take if given will be the miliseconds to add to the cur

  }

  render() {
    const socket = io.connect('http://127.0.0.1:3010');
    socket.emit('chat', {
      playerUpdate: {
        playerName: this.state.playerName,
        playerposition: this.state.playerPosition,
        playerSpeed: this.state.playerSpeed
      },
    })
    
    socket.on('chat', (data)=>{
      this.setState.pleyers
    console.log('the client is reciving data ->', data)
    })

    
    if (this.state.stage === 0 ) {  //if the form was filled out  ||   time is out      we can call these stages
      return (<JoinStage data={this.props} />)
    } else if (this.state.stage === 1 ) {     //time is out, race is taking place  
      return (<div> This will be the race component taking place</div>)
    } else if (this.state.stage === 2) {  // once the race is ove list the results. 
      return (<div>this will be the stats of the race once complete</div>)
    }
    return (<div>you got to the secrete stage, this can't be good x_X</div>)
  }
}

export default App;