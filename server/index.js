import React from 'react';

import express from 'express';
import fs from 'fs';
import path from 'path';
import { renderToPipeableStream } from 'react-dom/server';

import App from '../src/App'; // 共享的 React 组件

const app = express();

// 处理静态文件（Webpack 打包的静态文件）
app.use(express.static(path.resolve(__dirname, '../dist')));

// 服务端渲染 (SSR) 路由
app.get('/', (req, res) => {
  // 读取静态的 index.html 模板
  const templatePath = path.resolve('./public/index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  // 使用 renderToPipeableStream 流式渲染 React 内容
  const { pipe } = renderToPipeableStream(<App />, {
    onShellReady() {
      // 拆分模板内容，获取 <div id="root"></div> 之前和之后的部分
      const beforeRootHtml = template.split('<div id="root"></div>')[0]; // 模板的头部
      const afterRootHtml = template.split('<div id="root"></div>')[1];  // 模板的尾部

      // 设置响应的 Content-Type
      res.setHeader('Content-Type', 'text/html; charset=utf-8');

      // 先发送模板的头部内容
      res.write(beforeRootHtml);

      // 流式传输 React 渲染的内容到响应流
      pipe(res, {
        onCompleteAll() {
          // 插入模板尾部，包含 JS 引用和关闭 </body></html> 标签
          res.write(afterRootHtml); // 插入 JS 引用
          res.write(`</body></html>`)
          // 完成响应
          res.end();
        },
      });
    },
    onError(error) {
      console.error(error);
      res.status(500).send('Something went wrong');
    },
  });
});

// 启动服务器
app.listen(5001, () => {
  console.log('SSR server is running on http://localhost:5001');
});
