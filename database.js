// var mysql =require('mysql2');

// var con =mysql.createConnection({
//     host: "localhost",
//     user:"root",
//     password:"MANIganesh@9546",
//     database:"CustomerDetails"
// })


// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected");
//     con.query("Create table name cus", function(err, result){
//         if(err) throw err;
//         console.log("Database Created")
//     }); 
// });


const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "MANIganesh@9546",
  database: "CustomerDetails",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL Database!");

  // Create table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      address VARCHAR(255),
      total DECIMAL(10, 2)
    )
  `;

  con.query(createTableQuery, function (err, result) {
    if (err) throw err;
    console.log("Customers Table Created");
  });
});

// API endpoint to save billing details
app.post("/save-billing", (req, res) => {
  const { billTo, billToEmail, billToAddress, total } = req.body;

  const sql = `INSERT INTO customers (name, email, address, total) VALUES (?, ?, ?, ?)`;

  con.query(sql, [billTo, billToEmail, billToAddress, total], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).send("Server error");
    }
    res.status(200).send("Billing details saved successfully!");
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
