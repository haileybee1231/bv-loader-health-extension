import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.createElement('div');
  app.id = "bv-loader-health-extension-root";
  document.body.appendChild(app);
  ReactDOM.render(<App />, app);
})