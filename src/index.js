import React from 'react';
import ReactDOM from 'react-dom/client';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </NotificationProvider>
  </React.StrictMode>
);

reportWebVitals();