// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, getGoogleAnalyticsClientId } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPZ-XbRcCSIEIr7ecdIe6ekgSMa7XyeDA",
  authDomain: "ecommerce-mern-abc6f.firebaseapp.com",
  projectId: "ecommerce-mern-abc6f",
  storageBucket: "ecommerce-mern-abc6f.firebasestorage.app",
  messagingSenderId: "626204649022",
  appId: "1:626204649022:web:ca5e5e53b35a537beb536f",
  measurementId: "G-GH84THBSBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
 