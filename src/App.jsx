import { Component } from "react";
import "./App.css";
import Compose from "./components/Compose";
import LoginForm from "./components/LoginForm";
import MessageList from "./components/MessageList";
import UserList from "./components/UserList"
import { Grid, Paper, AppBar } from '@mui/material'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userList: [],
      events: [],
      username:"",
      password:"",
      url: "http://localhost:3000",
      needToLogin: true,
      streamToken: "",
      header: 'Chat',
      composePlaceholder: 'Enter a message to send'
    }
    this.serve = this.serve.bind(this)
    this.login = this.login.bind(this)
    this.setUsername = this.setUsername.bind(this)
    this.setPassword = this.setPassword.bind(this)
  }


    login() {
      var request = new XMLHttpRequest();
      var form = new FormData();
      form.append("password", this.state.password);
      form.append("username", this.state.username);
      request.open("POST", this.state.url + "/login");
      var that = this;
      request.onreadystatechange = function() {
          if (this.readyState !== 4) return;
          if (this.status === 201) {
              const data = JSON.parse(this.responseText);
              sessionStorage.setItem('messageToken', data.message_token)
              that.setState({
                password: "",
                username: "Loading...", 
                streamToken: data.stream_token,
                needToLogin: false
              })
              that.serve();
          } else if (this.status === 403) {
              alert("Invalid username or password");
          } else if (this.status === 409) {
              alert(that.state.username + " is already logged in");
          } else {
              alert(this.status + " failure to /login");
          }
      }
      request.send(form);
    }

    serve(){
      const server = new EventSource(`${this.state.url}/stream/${this.state.streamToken}`);
      server.addEventListener("Part", (event) =>{
        event = {...JSON.parse(event.data), type: 'Part'}
        var temp = this.state.userList
        temp.splice(this.state.userList.indexOf(event.user), 1)
        this.setState(prevState => ({userList: temp, 
          events: [...prevState.events, event], needToLogin:false})
      )}, false)
      server.addEventListener("open", (event) =>{
        this.setState(prevState => ({username: "", needToLogin: false}))
      }, false)
      server.addEventListener("Message", (event) => {
        var data = {...JSON.parse(event.data), type: 'Message'}
        this.setState(prevState => ({events: [...prevState.events, data], needToLogin:false}))
      }, false);
      server.addEventListener("Join", (event) => {
        var data = JSON.parse(event.data);
        var santizedData = {...data, type: 'Join'}
        this.setState(prevState => ({header: 'Chat', needToLogin: false, events: [...prevState.events, santizedData]}))
        if(this.state.userList.includes(data.user)) { this.setState(prevState => ({header: 'Chat'})); return}
        this.setState(prevState => ({userList: [...prevState.userList, data.user]}))
      }, false);
      server.addEventListener(
        "Disconnect",
        () => {
            server.close();
            this.disconnect()
            this.setState({events: []})
        },
        false
    );
      server.addEventListener("ServerStatus", (event) => {
        var parsedEvent = JSON.parse(event.data)
        var santizedData = {message: parsedEvent.status, created: parsedEvent.created, type: 'Status'}
        this.setState(prevState => ({events: [...this.state.events, santizedData]}))
      }, false);
      server.addEventListener("Users", (event => {
        this.setState(prevState => ({ userList: JSON.parse(event.data).users}))
      }), false);
      server.addEventListener(
        "error",
        (event) => {
            if (event.target.readyState === 2) {
                this.disconnect();
            } else {
                this.setState(prevState => ({header: "Disconnected, retrying"}))
                console.log("Disconnected, retrying");
            }
        },
        false
    );
      server.onerror = (_event) => {
        console.log("Connection lost, reestablishing");
      };
    }

    setUsername(value){
      this.setState({username: value})
    }

    setPassword(value){
      this.setState({password: value})
    }
    setURL(value){
      this.setState({url: value})
    }

    disconnect(){
      this.setState(prevState => ({needToLogin: true, messageToken: "", streamToken: "", userList: []}))
    }


  render() {
    // debugger

    return this.state.needToLogin? ( 
      <>
        <header>
          <AppBar style={{textAlign: 'center'}}>{'Log In to View Chat'}</AppBar>
        </header>
        <p>Not logged in</p>
        <LoginForm url={this.state.url} setURL={this.setURL} setUsername={this.setUsername} setPassword={this.setPassword} needToLogin={this.state.needToLogin} serve={this.serve} login={this.login} username={this.state.username} password={this.state.password}/>
      </>
      ) : (
      <>
        <header>
          <AppBar style={{textAlign: 'center'}}>{this.state.header}</AppBar>
        </header>
        <LoginForm setUsername={this.setUsername} setPassword={this.setPassword} needToLogin={this.state.needToLogin} serve={this.serve} login={this.login} username={this.state.username} password={this.state.password}/>
        <Grid mt={2} container spacing={2}>
          <Grid item xs={8} md={8}>
            <Paper style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'column'}}>
              <MessageList events={this.state.events}/>
              <Compose url={this.state.url} needToLogin={this.state.needToLogin}/>
            </Paper>
          </Grid>
          <Grid item xs={4} md={4}>
            <Paper >
              <UserList userList={this.state.userList} />
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default App;
