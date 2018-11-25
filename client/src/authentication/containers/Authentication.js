import React, { Component } from 'react';
import { Container } from 'reactstrap';
import Header from '../components/Header';
import Login from '../components/Login';
import { Switch, Route } from 'react-router-dom';

class Authentication extends Component {
    render() {
        return (
            <Container>
                <Header />
                <Switch>
                    <Route path={this.props.match.path + "/login"} component={Login} />
                </Switch>
            </Container>
        );
    }
}

export default Authentication;