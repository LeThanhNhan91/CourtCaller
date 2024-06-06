import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RouterCustom from './router';
import './style/style.scss';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId="272426862639-p6t7drbhrh22rep6bqrm3barul1b6f9l.apps.googleusercontent.com">
  <RouterCustom />
  </GoogleOAuthProvider>
  </BrowserRouter>
);


