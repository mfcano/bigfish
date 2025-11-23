import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFD-ukDDCEhSFGZ95CCB0oA_W0U2lfkQo",
  authDomain: "big-fish-9dbec.firebaseapp.com",
  projectId: "big-fish-9dbec",
  storageBucket: "big-fish-9dbec.firebasestorage.app",
  messagingSenderId: "130873640532",
  appId: "1:130873640532:web:846690c6be1b926b7a8fc1",
  measurementId: "G-VWY2WNEYW5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
