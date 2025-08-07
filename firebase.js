
// Configuration Firebase pour RED COMMAND RP
const firebaseConfig = {
  apiKey: "AIzaSyBX8O16331ikac8PQ_biEu8c1KTGoA6Fhk",
  authDomain: "red-command-darkrp-889fd.firebaseapp.com",
  projectId: "red-command-darkrp-889fd",
  storageBucket: "red-command-darkrp-889fd.firebasestorage.app",
  messagingSenderId: "186231864744",
  appId: "1:186231864744:web:98aa32b8eea2f18b67f19d"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
