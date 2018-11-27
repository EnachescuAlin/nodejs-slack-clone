import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Login from './authentication/containers/Login';
import Register from './authentication/containers/Register';
import { Switch, Route } from 'react-router-dom';
import { withRouter } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import requiresAuth from './common/components/requiresAuth';
import Test from './common/components/Test';

class App extends Component {
  render() {
    return (
      <TransitionGroup>
        <CSSTransition 
          key={this.props.location.key}
          classNames="fade"
          timeout={300}>
          <Switch location={this.props.location}>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/test" component={requiresAuth(Test)}/>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}

export default hot(module)(withRouter(App));
