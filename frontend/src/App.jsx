import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. 引入 BrowserRouter
import HomePage from './pages/HomePage'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  </React.StrictMode>
);

export default App;