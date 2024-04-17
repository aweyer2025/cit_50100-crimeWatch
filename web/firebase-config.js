// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADOaQuC1yPTP3Uvs00Mhs6L9qgbDa91hU",
  authDomain: "chicago-crimes-420200.firebaseapp.com",
  projectId: "chicago-crimes-420200",
  storageBucket: "chicago-crimes-420200.appspot.com",
  messagingSenderId: "261677296167",
  appId: "1:261677296167:web:f8c42723672546bf92bc02",
  measurementId: "G-969730HYJC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;