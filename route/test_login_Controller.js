const config = require('./config');
const jwt = require('jsonwebtoken');
const testdb = require('../database/database').testdb;
const bcrypt = require('bcrypt');
const { query } = require('./test_query_Controller');
exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.jwtSecretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

exports.register = async (req, res) => {
    const { username, password, phonenumber } = req.body;

    // console.log(usernam/e)/;
    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const querystring1 = `SELECT * FROM user_info WHERE username = '${username}'`;
        const querystring2 = `SELECT * FROM user_info WHERE phonenumber = '${phonenumber}'`;
        const querystring3 = `INSERT INTO user_info (username, password, phonenumber) VALUES ('${username}', '${hashedPassword}', '${phonenumber}')`;

        const results1 = await queryDatabase(querystring1);
        const results2 = await queryDatabase(querystring2);

        if (results1 && results1.length > 0) {
            res.status(200).send({ code: 400, msg: '用户名已存在' });
            return;
        }
        if (results2 && results2.length > 0) {
            res.status(200).send({ code: 400, msg: '手机号已存在' });
            return;
        }


        //向数据库插入数据
        testdb.query(querystring3);

        // 为新用户生成 JWT
        const token = jwt.sign({ username }, config.jwtSecretKey, {
            expiresIn: config.expiresIn
        });

        await res.send({ code: 200, msg: '注册成功', token: 'Bearer ' + token, username: username });
    } catch (error) {
        await res.status(500).send({ code: 500, msg: '服务器错误', error: error.message });
    }
}

//x-www-form-urlencoded
exports.login = async (req, res) => {

    const user = {
        // id: req.body.id,
        username: req.body.username,
        password: req.body.password
    }


    const querystring1 = `SELECT * FROM user_info WHERE username = '${user.username}'`;
    const results1 = await queryDatabase(querystring1);
    console.log(results1[0]['password']);
    if (results1.length === 0) {
        res.status(200).send({ code: 400, msg: '用户名或密码错误1' });
        return;
    }
    else {

        const isPasswordValid = await bcrypt.compare(user.password,results1[0]['password']);
        if (!isPasswordValid) {
            return res.status(200).send({ code: 400, msg: '用户名或密码错误' });
        }
    }
    // console.log(user.username)



    const token = jwt.sign(user, config.jwtSecretKey, {
        expiresIn: config.expiresIn
    });

    res.send({
        code: 200,
        msg: '登录成功',
        token: 'Bearer ' + token
    })
}

function queryDatabase(query) {
    return new Promise((resolve, reject) => {
        testdb.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}