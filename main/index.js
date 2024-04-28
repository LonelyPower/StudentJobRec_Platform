const express = require('express');
const app = express();
const mainRoutes = require('../route/mainRoutes');
const testmainRoutes = require('../route/testmainRoutes');
const port = 8888; // 选择一个适合的端口号
app.use(express.urlencoded({ extended: true }));

// 将路由中间件添加到 Express 应用程序
app.use('/api', mainRoutes);
app.use('/test_api', testmainRoutes);
app.use(express.static('../frontpage'))
// 监听端口
app.listen(port, () => {
  console.log(`服务器正在运行，访问 http://localhost:${port}`);
});