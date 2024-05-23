2024.5.23新增register和login功能，可以注册和登录，同时使用jwt验证，登陆或者注册成功后会返回token，在搜索信息时需要在请求头中携带token鉴权，详情见接口文档
测试的时候在test_api中，别在正式数据库中注册。
frontpage文件夹中是打包后的前端代码，是运行npm run build后生成的文件


如果下载下来要在本地运行的话，需要在StudentJobRec_Platform\frontpage\assets\index-C0Q7UvIq.js搜索''http://47.116.169.233:8888/api/query''
，改成''http://localhost:8888/api/query''
，不然会有跨域错误
