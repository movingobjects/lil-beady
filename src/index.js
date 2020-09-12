
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import style from 'styles/style.scss';

import App from 'components/App';
import Router from 'components/Router';
import store from 'store'

if (!process.env.FIREBASE_API_KEY?.length) {
  throw new Error('No Firebase API key specified in .env file');
}

firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "lil-beady.firebaseapp.com",
  databaseURL: "https://lil-beady.firebaseio.com",
  projectId: "lil-beady",
  storageBucket: "lil-beady.appspot.com",
  messagingSenderId: "85532380191",
  appId: "1:85532380191:web:3894c8aebb670c1d9e592a"
});

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
);
