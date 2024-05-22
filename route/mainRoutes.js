// routes/mainRoutes.js

const express = require('express');
const router = express.Router();
const loginController = require('./login_Controller');
const queryController = require('./query_Controller');

// 定义根路径的路由
router.get('/hello', loginController.authenticateJWT, queryController.index);
router.get('/', loginController.authenticateJWT, queryController.index);
router.get('/query', loginController.authenticateJWT, queryController.query)
router.post('/login', loginController.login)
router.post('/register', loginController.register)

module.exports = router;
