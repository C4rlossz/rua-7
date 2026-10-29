import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './store';
import App from './App';
import './styles.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '@fontsource/inter/latin-800.css';
import '@fontsource/barlow-condensed/latin-500.css';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/barlow-condensed/latin-900.css';

if (import.meta.env.DEV && new URLSearchParams(location.search).has('audit')) import('./dev-audit');

createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><StoreProvider><App /></StoreProvider></BrowserRouter></React.StrictMode>);

import './audit-improvements.css';
