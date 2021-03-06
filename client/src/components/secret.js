import React, { Component } from 'react';

export default class Home extends Component {
    state = {
        message: 'Loading...'
    };
    componentDidMount() {
        //GET message from server using fetch api
        fetch('/api/secret')
            .then(res => res.text())
            .then(res => this.setState({message: res}));
    }
    render() {
        return (
            <div>
                <h1>Home</h1>
                <p>{this.state.message}</p>
            </div>
        );
    }
}