const mysql = require('mysql2');

// accessing database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "employee_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected!")
  });

  module.exports = connection;