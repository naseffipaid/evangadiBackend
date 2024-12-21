const mysql2 = require("mysql2")

// const dbConnection = mysql2.createPool({
//     user:process.env.USER,
//     database:process.env.DATABASE,
//     host:"localhost",
//     password:process.env.PASSWORD,
//     connectionLimit:10
// })
// const dbConnection = mysql2.createPool({
//     user:process.env.USER,
//     database:process.env.DATABASE,
//     host:"sql101.infinityfree.com",
//     password:process.env.PASSWORD,
//     port:"3306",
//     connectionLimit:10
// })

// remote mysql from infinity

// host:"sql5.freesqldatabase.com"

const dbConnection = mysql2.createPool({
    user:process.env.USER,
    database:process.env.DATABASE,
    host:" localhost:3306",
    password:process.env.PASSWORD,
    port:"3306",
    connectionLimit:10
})

// console.log(process.env.JWT_SECRET)

// dbConnection.execute("select 'test' ", (err,result)=>{
//     if (err) {
//         console.log(err.message)
//     }else{
//         console.log(result)
//     }
// })

module.exports = dbConnection.promise();