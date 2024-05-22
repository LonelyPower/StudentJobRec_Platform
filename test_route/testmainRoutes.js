// routes/testmainRoutes.js

const express = require('express');
const router = express.Router();
const queryController = require('./test_query_Controller');
const loginController = require('./test_login_Controller');


// 定义根路径的路由
router.get('/hello', loginController.authenticateJWT, queryController.index);
router.get('/', loginController.authenticateJWT, queryController.index);
// router.get('/query/all',mainController.query_all)
router.get('/query', queryController.query)
// router.post('/add', mainController.add)
// router.post('/delete', mainController.delete)
// router.post('/login', mainController.login)
router.post('/login', loginController.login)
router.post('/register', loginController.register)


module.exports = router;
