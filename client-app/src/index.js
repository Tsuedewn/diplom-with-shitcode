import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from "./store/UserStore";
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'

export const Context = createContext(null)
export const FireContext = createContext(null)


const firebaseConfig = {
    apiKey: "AIzaSyA7-usPI-2IhRUc2NWnGvLmwLg4GPp0wHY",
    authDomain: "chat-diplo.firebaseapp.com",
    projectId: "chat-diplo",
    storageBucket: "chat-diplo.appspot.com",
    messagingSenderId: "852181630999",
    appId: "1:852181630999:web:64b20901d5e630ba439c52",
    measurementId: "G-0D7MHFPV70"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth()
const firestore = firebase.firestore()

ReactDOM.render(
    <FireContext.Provider value={{
        firebase,
        auth,
        firestore
    }}>
        <Context.Provider value={{
            user: new UserStore()
        }}>
            <App />
        </Context.Provider>
    </FireContext.Provider>,
  document.getElementById('root')
);
