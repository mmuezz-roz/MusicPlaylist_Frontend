import { useState } from 'react'

import viteLogo from '/vite.svg'
import './App.css'
import RegisterUser from "./assets/Components/register";

import { useEffect } from 'react'
import axios from "./api/axios";
import { Route, Routes,BrowserRouter } from 'react-router-dom';
import Loginser from './assets/Components/login';
import Home from './assets/Components/Home';
import Navbar from './assets/Components/Navbar';
import Songs from './assets/Components/Songs';
import Playlist from './assets/Components/Playlist';
import UploadSongs from './assets/Components/Uploadsongs';
import { Toaster } from "react-hot-toast";




function App() {
    return(
        <>
        {/* <BrowserRouter> */}

        <Toaster position='top-center'/>
        <Navbar/>
<Routes>
    <Route path='/' element={<Loginser/>}/>
    <Route path='/upload' element={<UploadSongs/>}/>
<Route path='/register' element={<RegisterUser/>}/>
<Route path='/login' element={<Loginser/>}/>
    <Route path='/Home' element={<Home/>}/>
    <Route path='/songs' element={<Songs/>}/>
    {/* <Route path='/Uploadsongs' element={<uploadSongs/>}/> */}
    <Route path='/playlist' element={<Playlist/>}/>
</Routes>
{/* </BrowserRouter> */}
</>
)}

export default App
