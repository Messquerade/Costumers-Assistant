import React from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
// import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => (
  // <Router>
  <React.Fragment>
    <Navbar />
    <Landing />
    {/* <Route exact path="/" component={Landing}/>
    <Switch>
      <Route exact path='/register' component={Register}/>
      <Route exact path='/login' component={Login}/>
    </Switch> */}
  </React.Fragment>
  // </Router>
);


export default App;
