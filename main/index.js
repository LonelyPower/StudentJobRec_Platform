const express = require('express');

const app = express();
const mainRoutes = require('../route/mainRoutes');
const testmainRoutes = require('../test_route/testmainRoutes');
const port = 8888; 

app.use(express.urlencoded({ extended: true }));
app.use('/api', mainRoutes);
app.use('/test_api', testmainRoutes);
app.use(express.static('../frontpage'))

// 监听端口
app.listen(port, () => {
  console.log(`服务器正在运行，访问 http://localhost:${port}`);
});