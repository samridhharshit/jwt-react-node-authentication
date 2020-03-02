import React, { Component } from 'react';
export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email : '',
            password: ''
        };
    }
    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    };
    onSubmit = (event) => {
        event.preventDefault();
        console.log(this.state);
        fetch('/api/authenticate', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log('res', res);
                    this.props.history.push('/');
                } else {
                    alert(JSON.stringify(res.status));
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });

    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Login Below!</h1>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={this.state.email}
                    onChange={this.handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                />
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}