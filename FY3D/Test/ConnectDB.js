/**
 * Created by shk on 15-11-25.
 * 测试链接mysql数据库（本机测试版本）
 */

var mysql=require('mysql');

var conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1',
    database:'NODEJS',
    port:3306
});

conn.connect();
//处理
conn.query('select * from t_user',function(err,rows,fields)
{
    if(err) {return callback( err);
    }
    console.log('the solution is:',rows[0]);
} );
conn.end();
//错误处理函数
function  callback(err)
{
 console.log(err);
}