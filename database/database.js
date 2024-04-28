const mysql = require('mysql');

const db = mysql.createPool({
	host: '47.116.169.233', //数据库的IP地址
	user: 'root', // 数据库的登陆账号
	password: 'Dachuangxiangmu123?', // 登录数据库的密码
	database: 'job_information' // 指定操作的数据库
});


module.exports = db