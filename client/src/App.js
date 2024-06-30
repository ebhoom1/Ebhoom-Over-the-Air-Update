import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Correct import for Bootstrap Icons
import './App.css';
import Upload from './components/Upload';

function App() {
  return (
    <div className="App">
        <header className="App-header">
            <h1>Ebhoom Over the Air Update</h1>
        </header>
        <main>
            <Upload />
        </main>
    </div>
);
   


}

export default App;
