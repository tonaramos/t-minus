import React from 'react';
import '../main.css';
import JoinStage from './JoinStage/JoinStage';
import RaceStage from './RaceStage/RaceStage';
const io = require('socket.io-client');
const socket = io.connect('https://damp-ocean-23457.herokuapp.com/');

socket.emit('checkIn')
console.log(socket);
let timeInterval;

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        trackLength: 100,
        finished: false,
        room: '',
        users: [],
        // rooms: {},
        numUsers: 0, 
        players: {},
        stage: 0,
        playerName: '',
        playerId: socket.id,
        playerPosition: 0,
        playerSpeed: 25,
        winners: [],
        timer: 0,
        userAddedToCount: false,
        namePlaceholder: 'Nyan'
      };

    this.moveToStageTwo = this.moveToStageTwo.bind(this);
    this.addPlayerToRoom = this.addPlayerToRoom.bind(this);
    this.nameUpdate = this.nameUpdate.bind(this);
    this.incrementPosition = this.incrementPosition.bind(this);
    this.singlePlayerUpdate= this.singlePlayerUpdate.bind(this);
    
    //========= USER UPDATE
    socket.on('firstUpdate', () => {    //am i using this? looks like i am
      this.state.players;
      this.setState({playerId: socket.id});
    })
    
    socket.on('login', (data) => {
      //console.log('receiving data at socket.on login client-> ',data);
      let tempPlayers = this.state.players;
      tempPlayers[data.userId] = data.playerUpdate;
      this.setState({players: tempPlayers});
      let tempUsers = this.state.users;
      tempUsers.push(data.playerUpdate.userId);
      this.setState({users: tempUsers});


    });

    socket.on('roomToJoin', data => {
      // console.log('got to roomToJoin handler');
      // console.log('before checking id socketid from client connection->',socket.id);
      // console.log('before checking id socketid from server connection->',data.id);
      if (data.id == this.state.playerId) {
        this.setState({room: data.room})
        socket.room = data.room;
        console.log('this socket ->',socket);
      }
      
      
    })

    socket.on('addToNumOfUsers', () => {
      this.setState({ numUsers: this.state.numUsers + 1});
    })

    //======== GAME UPDATE
    socket.on('timeLeft', (secondsLeft) => {
      this.setState({timer: secondsLeft.secondsLeft});
    })

    socket.on('gameUpdate', (data)=>{
      this.singlePlayerUpdate(data); 
    });

    socket.on('phaseTwoStart', () => {
      if(this.state.stage === 0){
        if (this.state.playerName.length === 0 ) {
          this.setState({playerName: this.state.namePlaceholder});
          this.addPlayerToRoom();
        }
        this.moveToStageTwo();
      }
    });

    socket.on('incomingFinisher', data => {
      let temp = this.state.winners;
      temp.push(data.username);
      this.setState({winners: temp});
    })

    socket.on('completeRace', () => {
      this.completeRace();
    })
  }
  

  //========= USER UPDATES
  nameUpdate (event) {
    this.setState( { playerName: event.target.value });
    if (!this.state.presenceUpdated) {
      socket.emit('addToNumOfUsers');
      this.setState({presenceUpdated:true});
    }

  }
  
  addPlayerToRoom() {
    socket.emit('add user',  {
      playerUpdate: {
        playerName: this.state.playerName,
        playerPosition: this.state.playerPosition,
        playerSpeed: this.state.playerSpeed
      }
    })
  }

  singlePlayerUpdate(data) {
    const tempPlayersObj = this.state.players;
    const user = data.userId;
    const playersObj = tempPlayersObj[user]; //this is a players object 
    playersObj[Object.keys(data.playerUpdate)[0]] = data.playerUpdate[Object.keys(data.playerUpdate)[0]];
    tempPlayersObj[user] = playersObj;
    this.setState({players: tempPlayersObj});
  }


  //========== STAGE UPDATES
  moveToStageTwo () {
    this.addPlayerToRoom();
    this.setState( { stage: this.state.stage + 1 });
    clearInterval(timeInterval);
  }

  completeRace() {
    this.setState({stage:2});
  }


  //========== RACE UPDATES  increment
  incrementPosition() {
    if(this.state.playerPosition < this.state.trackLength) {
      this.setState({playerPosition: this.state.playerPosition + .5})
      socket.emit('goClick', {
        username: this.state.playerName,
        playerUpdate: {
          playerPosition: this.state.playerPosition + .5,
        },
      });
    }
    this.checkWinners();
  }

  //========= END OF RACE UPDATES
  sendFinisher() {
    socket.emit('finisher', {
      username: this.state.playerName
    });
  }
 
  checkWinners () {
    if (this.state.winners.length === this.state.users.length  || this.state.winners.length === 5) {
     // this.completeRace();
      socket.emit('completeRace');       // Use this if winner should unly be 3!!!!!!!!!!!
    } 
    if (this.state.playerPosition >= this.state.trackLength && !this.state.finished) {
      this.setState({finished: true});
      this.sendFinisher();
    }
  }
  
  mapWinners() {
   return this.state.winners.map((player, i) =>{
      return (
        <div>
          <div key={player+i}>{`${i+1} - ${player}!`}</div>
        </div>
      )
    })
  }


  //===========================  RENDER ============================

  render() { 
    
      //   === STAGE LOGIN ===
    if (this.state.stage === 0 ) { 
      return (
        <div className="loginBoardContainer">
          <div className="loginBoard">
            <div className="timerContainer">
              <div className="timer">
                { this.state.timer > 9 ? `T-minus 00:${this.state.timer} ` : `T-minus   00:0${this.state.timer} `}
              </div>
            </div>
            <div className="joinStageContainer">
                <JoinStage data={this.state} updateName={this.nameUpdate}/>
            </div>  
            <div className="numberOfUsersContainer">
              <div className="numberOfUsers">
                { this.state.numUsers > 0 ? `Reacers ready ${this.state.numUsers}` : 'No racers at this time o_0' }
              </div>
            </div>
          </div>  
        </div>
      )

      //   === STAGE RACE ===
    } else if (this.state.stage === 1 ) {     //time is out, race is taking place  
      return (
        <div className="stageTwoContainer">
          <RaceStage players={this.state.players} emitProgress={this.nameUpdate} updateMyState={this.updateMyState} 
            incrementPosition={this.incrementPosition} />
        </div>

        //   === STAGE RESULTS ===
    )} else if (this.state.stage === 2) {  // once the race is ove list the results. 
      return (
      <div className="thirdStage">
        <div className="nameTable">
        <div className="titleContainer">
          <div>Winners! </div>
        </div>
        <div className="list">
          {this.mapWinners()}
        </div>
        <div className="scoreBoard">    
        </div>
        </div>
      </div>
    )}

    return (<div>you got to the secrete stage, this can't be good x_X</div>)
  }
}

export default App;



/*

const players = Object.keys(this.state.players).length > 0 ? (
      Object.keys(this.state.players).map( (key, index) => {
        const tempObj = this.state.players[key];
        return <div key={key+index} >{tempObj.playerName}</div>
      })
*/