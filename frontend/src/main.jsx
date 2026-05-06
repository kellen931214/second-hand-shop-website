import React, { StrictMode } from 'react'; // 必須在這裡解構 StrictMode
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css'; 
import App from './App'; // 確保 App.jsx 檔案存在於 src 目錄下

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App /> 
    </BrowserRouter>
  </StrictMode>
);