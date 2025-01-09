import React from 'react';

import ReactDOM from 'react-dom/client';

import App from '../src/App'; // 共享的React组件

// 客户端渲染，Hydration过程
const root = ReactDOM.hydrateRoot(document.getElementById('root'), <App />);

// 注册Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/public/service-worker.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}
