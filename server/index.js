import React from 'react';

import express from 'express';
import fs from 'fs';
import path from 'path';
import { renderToPipeableStream } from 'react-dom/server';

import App from '../src/App'; // 共享的React组件

const app = express();

// 处理静态资源
app.use('/public', express.static(path.resolve(__dirname, '../dist')));

// SSR路由
app.get('/', (req, res) => {
  // 从打包好的HTML模板中读取
  const template = fs.readFileSync(path.resolve('./public/index.html'), 'utf-8');

  // 使用流式渲染
  const { pipe } = renderToPipeableStream(<App />, {
    onShellReady() {
      // 向客户端发送HTML流
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200);
      pipe(res);
    },
    onError(error) {
      console.error(error);
      res.status(500).send('Something went wrong');
    }
  });
});

// 启动服务
app.listen(5001, () => {
  console.log('SSR server is running on http://localhost:5001');
});
