import React from 'react';
import reactDom from 'react-dom';
import './App.css';
import Nav from './components/navComponent/nav'
import Blank from './components/blank/blan';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';


class App extends React.Component {
  render(){
  return (
    <div className="App">
      {/* <BrowserRouter basename="/">
      <Switch>
        <Route path="/" component={Nav} />
        <Route path="/other" component={Blank}/>
      </Switch>
    </BrowserRouter>, */}
    <Nav></Nav>
    </div>
  );
  }
}

export default App;
