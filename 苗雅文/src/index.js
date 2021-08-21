import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AppContainer } from 'react-hot-loader';
// import Blank from './components/blank/blan';
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom';

ReactDOM.render(
  <AppContainer>
    <BrowserRouter basename="/">
      <Switch>
       <Route exact path="/" component={App} />
        {/* <Route path="/other" component={Blank}/>  */}
      </Switch>
    </BrowserRouter>
    </AppContainer>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
