import React, { Component } from 'react'

import {List, ListItem, ListItemText, ListSubheader} from '@mui/material'

class UserList extends Component{

    displayUserList(){
        if (!this.props.userList){
            return "no users"
        }
        return this.props.userList.length > 0? this.props.userList.map( (user) => {
            return(
            <ListItem key={user} disablePadding>
                <ListItemText primary={user} />
            </ListItem>)
        }) : "no users"
    }

    render(){
        return(
        <List style={{paddingLeft: '8px'}} subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              User List
            </ListSubheader>
          }>
            {this.displayUserList()}
        </List>
        )
    }
}

export default UserList