import React, { Component } from 'react';
import { Box, Dialog, FormGroup, FormLabel, Input } from '@mui/material';

class LoginDialog extends Component {
    
    render(){

      return(
          <Dialog open={this.props.needToLogin}>
          <Box p={5}>
            <FormGroup>
              <Box pb={2}>
                <FormLabel>
                  {"Username: "}
                </FormLabel>
                <Input onKeyUp={(e) => {if(e.key === 'Enter') this.props.login()}} onChange={(e) => this.props.setUsername(e.target.value)} value={this.props.username}/>
              </Box>
              <Box id="loginForm">
                <FormLabel id="loginForm">
                    {"Password: "}
                  </FormLabel>
                <Input id="loginForm" type="password" onKeyUp={(e) => {if(e.key === 'Enter') this.props.login()}} onChange={(e) => this.props.setPassword(e.target.value)} value={this.props.password} />
              </Box>
            </FormGroup>
          </Box>
        </Dialog>
      )
    }
}

export default LoginDialog