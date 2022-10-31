import React, { Suspense, lazy } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAnalytics} from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
const firebaseConfig = {
    apiKey: "AIzaSyBmSG0ulPPy-A2SgAELbwF-f467doKJiw4",
    authDomain: "ets-url-shortener.firebaseapp.com",
    projectId: "ets-url-shortener",
    storageBucket: "ets-url-shortener.appspot.com",
    messagingSenderId: "44963408642",
    appId: "1:44963408642:web:83caa24a0d7c31052b301b",
    measurementId: "G-LKSEDM1380"
};
export const firebase = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebase);
export const firestore = getFirestore(firebase);
export const auth = getAuth(firebase);

const Home = lazy(() => import("./pages/Home"));
const Redirect = lazy(() => import("./pages/Redirect"));

function App() {
    return (
        <BrowserRouter>
            <Suspense>
                <Routes>
                    <Route index element={<Home/>}/>
                    <Route path={"/*"} element={<Redirect/>}/>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
