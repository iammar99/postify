// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage"
import {GoogleAuthProvider } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxbCAvgnIn5-WlWTN72XN7j4t5EXmcqSQ",
  authDomain: "postify-app.firebaseapp.com",
  projectId: "postify-app",
  storageBucket: "postify-app.appspot.com",
  messagingSenderId: "52168748683",
  appId: "1:52168748683:web:ed03465ed1efcdf3b22e8e",
  measurementId: "G-MBRCDL49Q1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const fireStore = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)
const provider = new GoogleAuthProvider();

export {app , analytics , auth , fireStore , storage ,provider}