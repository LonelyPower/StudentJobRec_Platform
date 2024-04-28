// controllers/mainController.js
const testdb = require('../database/testdatabase');
// const router = require('./mainRoutes');s
const table = 'jobtest';
exports.index = function (req, res) {
    res.send('你好');
};

exports.query = (req, res) => {
    let whereClause = '';
    const queryParams = req.query;
    let amount = 30;
    let page = 1;
    if (queryParams.hasOwnProperty("amount")) {
        amount = queryParams.amount;
        delete queryParams.amount;
    }
    if (queryParams.hasOwnProperty("page")) {
        page = queryParams.page;
        delete queryParams.page;
    }
    if (Object.keys(queryParams).length === 0) {
        whereClause = '';
    }
    else {
        whereClause = 'WHERE ';
        Object.keys(queryParams).forEach((key, index) => {
            const value = queryParams[key];
            if (index > 0) {
                whereClause += ' AND ';
            }
            whereClause += `${key} LIKE '%${value}%'`;
        });
    }
    let a = (page - 1) * amount;
    // const queryString = `SELECT * FROM job ${whereClause} LIMIT ${amount} OFFSET ${a}`;
    const queryString = `SELECT * FROM ${table} ${whereClause} LIMIT ${amount} OFFSET ${a}`;
    console.log(queryString);
    testdb.query(queryString, (err, results) => {
        if (err) {
            res.json({
                status: 400,
                err:
                {
                    sqlMessage: err.sqlMessage,
                    errno: err.errno
                },
            });
        }
        else {
            if (Object.keys(results).length < amount) {
                amount = Object.keys(results).length;
            }
            res.json({
                status: 200,
                amount: amount,
                results,
            });
        }
    });
};

exports.add = async (req, res) => {
    const { 公司名 = 'NULL', 职位 = 'NULL', 地区 = 'NULL', 要求经验 = 'NULL', 详情页 = 'NULL', 薪酬 = 'NULL', 类别 = 'NULL' } = req.body;
    const contents = { 公司名, 职位, 地区, 要求经验, 详情页, 薪酬, 类别 };
    values = '(';
    for (const key in contents) {
        if (contents[key] !== 'NULL') {
            values += '\'' + contents[key] + '\'' + ',';
        }
        else {
            values += 'NULL,';
        }
    }
    let lastIndex = values.lastIndexOf(',');
    if (lastIndex !== -1) {
        values = values.substring(0, lastIndex) + values.substring(lastIndex + 1);
    }
    values += ')';
    const queryString = `INSERT INTO ${table} ( 公司名, 职位, 地区, 要求经验, 详情页, 薪酬, 类别) VALUES ${values}`;
    // console.log(queryString);

    testdb.query(queryString, (err, results) => {
        if (err) {
            res.json({
                status: 400,
                err:
                {
                    sqlMessage: err.sqlMessage,
                    errno: err.errno
                },
            });
        }
        else {
            res.json({
                status: 200,
                results:
                {
                    affectedRows: results.affectedRows
                }
            });
        }
    });
}

exports.delete = async (req, res) => {
    let a = req.body.id.slice(1, -1);
    let nums = a.split(',').map(Number); // 将字符串拆分成数组，并将每个元素转换为数字
    let maxNum =  parseInt(Math.max(...nums)); // 找到数组中的最大值
    // let maxInt =maxNum; // 将最大值转换为整数

    const queryString = `DELETE FROM ${table} WHERE id IN(${a}) `;
    const queryString1 = `ALTER TABLE ${table} DROP id`;
    const queryString2 = `ALTER TABLE ${table} ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST`;
    const queryString3 = `SELECT MAX(id) AS max_id FROM ${table}`;
    testdb.query(queryString3, (err, results) => {
        // console.log(results[0].max_id);
        // console.log(req.body.id);
        if (maxNum > results[0].max_id) {
            return res.json({
                status: 400,
                err: {
                    sqlMessage: 'id out of range',
                },
            });
        }
        else {
            testdb.query(queryString, (err, results) => {
                if (err) {
                    res.json({
                        status: 400,
                        err: {
                            sqlMessage: err.sqlMessage,
                            errno: err.errno
                        },
                    });
                }
                else {
                    // 执行第二个查询
                    testdb.query(queryString1, (err, results) => {
                        if (err) {
                            res.json({
                                status: 400,
                                err: {
                                    sqlMessage: err.sqlMessage,
                                    errno: err.errno
                                },
                            });
                        }
                        else {
                            // 执行第三个查询
                            testdb.query(queryString2, (err, results) => {
                                if (err) {
                                    res.json({
                                        status: 400,
                                        err: {
                                            sqlMessage: err.sqlMessage,
                                            errno: err.errno
                                        },
                                    });
                                }
                                else {
                                    res.json({
                                        status: 200,
                                        results: `成功删除${nums.length}条数据`
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}