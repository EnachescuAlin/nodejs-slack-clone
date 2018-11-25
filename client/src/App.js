import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import Authentication from './authentication/containers/Authentication';
import { Switch, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/authenticate" component={Authentication} />
        </Switch>
      </div>
    );
  }
}

export default hot(module)(App);
