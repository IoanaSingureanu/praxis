import * as firebase from 'firebase';

// Web app's Firebase configuration
const config = {
  apiKey: "AIzaSyAyw3mwDprDZbrawMOpJuOk6R6dg2lFszE",
  authDomain: "fhim-2de9c.firebaseapp.com",
  databaseURL: "https://fhim-2de9c.firebaseio.com",
  projectId: "fhim-2de9c",
  storageBucket: "fhim-2de9c.appspot.com",
  messagingSenderId: "628713125497",
  appId: "1:628713125497:web:9a2686aa4ceaeaf6"
};
// Initialize Firebase
firebase.initializeApp(config);

// Add first Entry

var email = 'praxis.editor@gmail.com';
var password = 'pixel&velevet$';

const database = firebase.database();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const signInWithEmailAndPassword = new firebase.auth().signInWithEmailAndPassword(email, password);


export { firebase, googleAuthProvider, signInWithEmailAndPassword, database as default };

