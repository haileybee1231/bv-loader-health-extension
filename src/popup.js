import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './Popup.jsx';

chrome.runtime.sendMessage({ type: 'bv-loader-extension-unmounted' });

const loadListener = document.addEventListener('DOMContentLoaded', () => {
    const app = document.createElement('div');
    app.id = "bv-loader-health-extension-root";
    document.body.appendChild(app);
    ReactDOM.render(<Popup />, app);
    document.removeEventListener('DOMContentLoaded', loadListener);
});
