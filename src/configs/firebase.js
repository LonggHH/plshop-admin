import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAfKsJpREHk14jYCzhk_OFASjJ7rksI4j0",
    authDomain: "pistore-6b669.firebaseapp.com",
    projectId: "pistore-6b669",
    storageBucket: "pistore-6b669.appspot.com",
    messagingSenderId: "941584457668",
    appId: "1:941584457668:web:7e5c7415a3231c2c970e91",
    measurementId: "G-QBKB81Z3MJ"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);