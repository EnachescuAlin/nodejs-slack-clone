import React, { Component } from 'react';
import { hot } from 'react-hot-loader'
import logo from './assets/logo.svg';

class App extends Component {
  render() {
    return (
      <div>
        <img src={logo}/>
        <p>Hello World</p>
      </div>
    );
  }
}

export default hot(module)(App);
