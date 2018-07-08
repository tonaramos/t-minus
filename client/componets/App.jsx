import React from 'react';
import '../main.css';
import JoinStage from './JoinStage/JoinStage';
const io = require('socket.io-client');
const socket = io.connect('http://127.0.0.1:3010');
// const info = socket.on('chat', (data)=>{
//  return data;
//   });

  // console.log('data from did mount ->',data)


class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        users: [],
        rooms: {},
        clients: 0, 
        players: {},
        stage: 0,
        playerName: '',
        playerPosition: 250,
        playerSpeed: 25
      };
      this.moveToNextStage = this.moveToNextStage.bind(this);
      this.emit = this.emit.bind(this);
      this.nameUpdate = this.nameUpdate.bind(this);
    }
    componentDidMount() {
      socket.on('chat', (data)=>{

        if (!this.state.players[data.userId]) {
          this.setState(this.state.players[data.userId] = data.playerUpdate);
          this.state.users.push(data.userId);
        }
        this.setState({
          rooms: data.rooms,
          clients: data.usersConnected 
        });      
        console.log('data from did mount ->',data)
     });
      
    }

  emit() {
    socket.emit('chat', {
      playerUpdate: {
        playerName: this.state.playerName,
        playerposition: this.state.playerPosition,
        playerSpeed: this.state.playerSpeed
      },
    })
  }

  // initialRoomInfo () {
  //   socket.on('chat', (data)=>{
  //     if (!this.state.players[data.userId]) {
  //       this.setState(this.state.players[data.userId] = data.playerUpdate);
  //       this.state.users.push(data.userId);
  //     }
  //     //data.roomsOpen => { room1: false; room2: true, room3: false}
  //     this.setState( {rooms: data.roomsOpen} )
  //   });
  // }

  joinRoom (roomName) {
    socket.on('connect', () => {
      socket.emit(room, roomName);
      
    });


  }

  moveToNextStage () {
    this.setState( { stage: this.state.stage + 1 });
  }

  nameUpdate (event) {
    this.setState( { playerName: event.target.value });
  }

  

  render() {    
  



    // socket.on('chat', (data)=>{
    //   if (!this.state.players[data.userId]) {
    //     this.setState(this.state.players[data.userId] = data.playerUpdate);
    //     this.state.users.push(data.userId);
    //   } 
    // });

    const players = Object.keys(this.state.players).length > 0 ? (
      Object.keys(this.state.players).map( (key, index) => {
        // if (index === 0 || index%2 === 0) {
        const tempObj = this.state.players[key];
        return <div key={key} >{tempObj.playerName}</div>
        // }
      })
    ) : (
      'No players in room at this time o_0'
    );

    if (this.state.stage === 0 ) {  //if the form was filled out  ||   time is out      we can call these stages
      return (
        <div>
          {players }
          <JoinStage data={this.state} updateName={this.nameUpdate}/>
          <input type="submit" value="Add name to room!" onClick={this.emit} />
          <input type="submit" value="GO!" onClick={this.moveToNextStage}/>
        </div>
      )
    } else if (this.state.stage === 1 ) {     //time is out, race is taking place  
      return (<div> This will be the race component taking place</div>)
    } else if (this.state.stage === 2) {  // once the race is ove list the results. 
      return (<div>this will be the stats of the race once complete</div>)
    }
    return (<div>you got to the secrete stage, this can't be good x_X</div>)
  }
}

export default App;