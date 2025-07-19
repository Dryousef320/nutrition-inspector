import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCA9vT7Q1fo6i4pqdx7MsEGqp2G2Sy",
  authDomain: "inspector-4120c.firebaseapp.com",
  projectId: "inspector-4120c",
  storageBucket: "inspector-4120c.appspot.com",
  messagingSenderId: "74146329150",
  appId: "1:74146329150:web:9c1091e7db745dc5ffbd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };