import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import LoginComponent from './login/login';
import SignupComponent from './signup/signup';
import DashboardComponent from './dashboard/dashboard';
import forgottenPasswordComponent from './forgottenpassword/forgottenPassword'

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
    apiKey: "AIzaSyBKbdsg3aeigiJGmuKzoZ1I22vvythfGfY",
    authDomain: "react-chat-8762f.firebaseapp.com",
    databaseURL: "https://react-chat-8762f.firebaseio.com",
    projectId: "react-chat-8762f",
    storageBucket: "react-chat-8762f.appspot.com",
    messagingSenderId: "67602882752",
    appId: "1:67602882752:web:4cc11a8e4c36d82f0a0d25"
});

const routing = (
    <Router>
        <div id='routing-container'>
        <Route path='/login' component={LoginComponent}></Route>
        <Route path='/signup' component={SignupComponent}></Route>
        <Route path='/dashboard' component={DashboardComponent}></Route>
        <Route path='/passwordreset' component={forgottenPasswordComponent}></Route>
        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
