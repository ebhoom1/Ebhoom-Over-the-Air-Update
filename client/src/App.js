import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Correct import for Bootstrap Icons
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://13.233.118.179:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLink(response.data);
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file!');
      console.error(error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Ebhoom Over the Air Update</h1>
      <div className="card p-4">
        <h2 className="text-center">Upload PEM File</h2>
        <div className="form-group">
          <input type="file" className="form-control-file" onChange={handleFileChange} />
        </div>
        <button className="btn btn-primary btn-block mt-3" onClick={handleUpload}>Upload</button>
        {link && (
          <div className="mt-3">
            <p>Download Link:</p>
            <div className="input-group">
              <input type="text" className="form-control" value={link} readOnly />
              <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button" onClick={handleCopy}>
                  <i className="bi bi-clipboard"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
