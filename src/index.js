import React from 'react';
import ReactDOM from 'react-dom/client';
import { NotificationProvider } from './context/NotificationContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotificationProvider>
      <HelmetProvider>
        <BrowserRouter>
          <CartProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </CartProvider>
        </BrowserRouter>
      </HelmetProvider>
    </NotificationProvider>
  </React.StrictMode>
);

reportWebVitals();