
import React,{ StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';

const rootElement = document.getElementById('userRoot');
const root = createRoot(rootElement);

root.render(
<StrictMode>
<App />
</StrictMode>
);