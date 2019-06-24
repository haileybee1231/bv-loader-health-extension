import React from 'react';
import ReactDOM from 'react-dom';
import Popup from '../Popup.jsx';

// Every time the page is loaded and this script is injected, send this event
// so that the previous instance of the extension gets unmounted and re-inits
chrome.runtime.sendMessage({ type: 'bv-loader-extension-unmounted' });

// When DOM Content is ready,
const loadListener = document.addEventListener('DOMContentLoaded', () => {
    // create root element
    const app = document.createElement('div');
    app.id = "bv-loader-health-extension-root";
    document.body.appendChild(app);

    // inject extension
    ReactDOM.render(<Popup />, app);

    // clean up event listener
    document.removeEventListener('DOMContentLoaded', loadListener);
});
