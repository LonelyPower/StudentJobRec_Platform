// routes/testmainRoutes.js

const express = require('express');
const router = express.Router();
const mainController = require('./testmainController');

// 定义根路径的路由
router.get('/hello', mainController.index);
// router.get('/query/all',mainController.query_all)
router.get('/query', mainController.query)
router.post('/add',mainController.add)
router.post('/delete',mainController.delete)

module.exports = router;
