import React from 'react';
import {AUTH_TOKEN} from 'Constants'

class Routerpage extends React.Component{
    componentDidMount() {
        console.log("current location:"+process.env.PUBLIC_URL);
        
        
      }
    render(){
        const {Component} = this.props;
        const props =this.props;
        return (<Component {...props} />)
    }

}