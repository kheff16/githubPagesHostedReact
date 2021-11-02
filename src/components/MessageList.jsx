import React, { Component } from 'react'
import { Paper, List, ListItem, ListItemText } from '@mui/material'


export class MessageList extends Component {

    // https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react

    componentDidUpdate(){
        this.scrollToBottom();
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }

    render() {
        const messages = this.props.events? this.props.events.map( (message) => {
            var text
            var dateAndTime = new Date(message.created * 1000).toLocaleDateString("en-US") + ' ' + new Date(message.created * 1000).toLocaleTimeString("en-US")
            switch(message.type){
                case 'Message':
                    text = message.user? `${message.user} says: ${message.message} at ${dateAndTime}` : `${message.message} at ${dateAndTime}`
                    break;
                case 'Join':
                    text = `JOIN ${message.user} at ${dateAndTime}`
                    break;
                case 'Part':
                    text = `PART ${message.user} at ${dateAndTime}`
                    break;
                case 'Status':
                    text= `STATUS ${message.message} at ${dateAndTime}`
                    break;
                default:
                    return ""
            }
            return( <ListItem key={message.created.toString()} disablePadding>
                <ListItemText primary={text} />
            </ListItem>)
        }) : 'no messages'
        return (
            <Paper style={{ paddingLeft: '8px', height: '85vh', overflow: 'auto'}}>
                <List style={{ overflow: 'auto'}}>
                {messages}
                <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el; }}></div>
                </List>
            </Paper>
        )
    }
}

export default MessageList
