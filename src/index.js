import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 在开发环境中使用模拟API
if (process.env.NODE_ENV === 'development') {
    import('./mockData/mockApi').then(({ setupMockApi }) => {
        setupMockApi();
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// 性能测量
reportWebVitals();