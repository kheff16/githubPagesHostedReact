import { Input } from '@mui/material'
import React, { Component } from 'react'

export class Compose extends Component {

    postMessage(e){
        var messageToken=sessionStorage.getItem('messageToken')

        if (messageToken === null || e.keyCode !== 13)
            return;
        e.preventDefault();
        if (e.target.value === "") return;
    
        var form = new FormData();
        form.append("message", e.target.value);
    
        var request = new XMLHttpRequest();
        // request.open("POST", sessionStorage.getItem("url") + "/message");
        request.open("POST", process.env.REACT_APP_BASE_URL + "/message");
        request.setRequestHeader(
            "Authorization",
            "Bearer " + messageToken
        );
        request.onreadystatechange = function(event) {
            if (event.target.readyState === 4 && event.target.status !== 403 && messageToken !== null) {
                messageToken = event.target.getResponseHeader("token");
                sessionStorage.setItem('messageToken', messageToken)
            }
        }
        request.send(form);
    
        e.target.value = "";
    }

    render() {
        return (
            <Input onKeyUp={(e) => this.postMessage(e)} placeholder={this.props.needToLogin? 'You need to log in before writting messages.' : 'Type a message here'} />
        )
    }
}

export default Compose
