import Firebase from 'firebase';
 let config = {
    apiKey: "AIzaSyAYcGVPOVEd444bzWLuylntDg7zeuL8AbE",
    authDomain: "fyptest2-d4e27.firebaseapp.com",
    databaseURL: "https://fyptest2-d4e27.firebaseio.com",
    projectId: "fyptest2-d4e27",
    storageBucket: "",
    messagingSenderId: "645621326255",
    appId: "1:645621326255:web:152d1d1d22da6775"
  };
  let app = Firebase.initializeApp(config);
export const db = app.database();