const express = require('express');
const mysql = require('mysql');

const dbConfig = require('./db/DBConfig');
const userSQL = require('./db/Usersql');
const app = express();
// const router = express.Router();
const port = 8085;
const pool = mysql.createPool(dbConfig.mysql);

// app.get('/', (req, res) => {
//   res.send(index);
// });

const logger = (req, res, next) => {
    console.log(Date.now());
    next();
}
app.use(logger);

app.use('/', express.static('web'));

const responseJSON = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'-200',     msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

app.get('/addUser', function(req, res, next){
    pool.getConnection(function(err, connection) {
        if (connection) {
            console.log('链接成功');
        }
        console.log(connection);
        var param = req.query || req.params;
        console.log(param);
        connection.query(userSQL.insert, [param.id, param.name, param.age], function(err, result) {
            if(result) {
                result = {
                    code: 200,
                    msg:'增加成功'
                };
            } else {
                // console.log(err);
            }

            // 以json形式，把操作结果返回给前台页面
            responseJSON(res, result);

            // 释放连接
            connection.release();

        });
    });
    console.log('addUser');
});

app.get('/queryAll', (req, res, next) => {
   pool.getConnection((err, connection) => {
       try{
           const param = req.query || req.params;
           connection.query(userSQL.queryAll, [], (err, result) => {
               if (result) {
                   result = {
                       code: 200,
                       msg: '成功',
                       result: result,
                   };
               } else {
                   console.log(err);
               }
               console.log(result);
               responseJSON(res, result);
               connection.release();
           });
       }catch (e) {
          console.log(e);
       }
   })
});

app.listen(port, () => {
  console.log('server start port:' + 8085);
})
