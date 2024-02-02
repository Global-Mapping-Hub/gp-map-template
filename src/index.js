import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import App from './App';
import { isDevMode } from './Utilities/Helpers';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	isDevMode() ?
		<BrowserRouter>
			<Routes>
				<Route path="*" element={<App />} />
			</Routes>
		</BrowserRouter>
	:
		<React.StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="*" element={<App />} />
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
);
