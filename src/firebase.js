import firebase from 'firebase/app'
import 'firebase/firestore'


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyC9MyUSlAWO_XOLdW9S-dnX8fgWDM719o0",
    authDomain: "mylist-53a33.firebaseapp.com",
    projectId: "mylist-53a33",
    storageBucket: "mylist-53a33.appspot.com",
    messagingSenderId: "554204363871",
    appId: "1:554204363871:web:3050a6726ee27564136fea"
  };
  // Initialize Firebase
  const fb = firebase.initializeApp(firebaseConfig);

  export const db = fb.firestore();