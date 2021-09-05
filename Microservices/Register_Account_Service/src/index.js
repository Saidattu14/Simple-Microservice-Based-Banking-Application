const {Client} = require('pg');
var amqp = require('amqplib/callback_api');
var jwt = require('jsonwebtoken');
var Query = require('./Query')
const client = new Client({
    user: 'user',
    host: 'localhost',
    password: '123456',
    port: 5431,
    database : 'default_database'
  })
const create_table = `CREATE TABLE User_Information(
  PersonID varchar(255) NOT NULL PRIMARY KEY,
  LastName varchar(255) NOT NULL,
  FirstName varchar(255) NOT NULL,
  Address varchar(255),
  City varchar(255),
  UserName varchar(255) NOT NULL,
  CurrentBalance int,
  CreatedDate Date,
  Password varchar(255) NOT NULL,
  DeletedDate Date,
  AccountNumber int NOT NULL UNIQUE,
  BranchCode varchar(255),
  MobileNumber varchar(255) NOT NULL
)`;
const credit_table = `CREATE TABLE CreditDetails_Information(
  Credit_Account_PersonID varchar(255) NOT NULL,
  Credit_Account_Number int NOT NULL,
  User_Account_Number int NOT NULL,
  Amount int,
  CreatedDate Date,
  Transaction_id int NOT NULL PRIMARY KEY
)`;
const debit_table = `CREATE TABLE DebitDetails_Information(
  Account_Number varchar(255) ,
  Amount int,
  CreatedDate Date,
  Transaction_id  int NOT NULL PRIMARY KEY
  
)`;
try {
  client.connect()
  //  client.query("DROP TABLE User_Information",(err,res) => {
  //     console.log(res)
  //   })
  //  client.query("DROP TABLE CreditDetails_Information",(err,res) => {
  //     console.log(res)
  //   })
  //   client.query("DROP TABLE DebitDetails_Information",(err,res) => {
  //     console.log(res)
  //   })
} catch (error) {
  console.log("DataBase is not Connected")
}
const database_fumctioning = async() => {
  const check = `SELECT *
  FROM pg_catalog.pg_tables
  WHERE schemaname != 'pg_catalog' AND 
      schemaname != 'information_schema'`;
  client.query(check,function(err,res){
     if(err)
     {
       console.log(err);
     }
     else
     {
       var arr = res.rows;
       let result = 0;
       let result1 = 0; 
       let result2 = 0;
       for(let i= 0; i<arr.length;i++)
       {
         if(arr[i].tablename == 'user_information')
         {
          //  console.log("Table is Present")
           result = 1;
          
         }
         if(arr[i].tablename == 'creditdetails_information')
         {
           result1 = 1;
           
         }
         if(arr[i].tablename == 'debitdetails_information')
         {
           result2 = 1;
          
         }
       }
       if(result == 0)
       {
        client.query(create_table,function(err,res) {
        if(err)
        {
          console.log(err);
        }
        else
        {
         console.log("Table Created1");
        }});
      }
      if(result1 == 0)
       {
        client.query(credit_table,function(err,res) {
        if(err)
        {
          console.log(err,"dkkdk");
        }
        else
        {
         console.log("Table Created2");
        }});
      }
      if(result2 == 0)
       {
        client.query(debit_table,function(err,res) {
        if(err)
        {
          console.log(err,"dkkdk");
        }
        else
        {
         console.log("Table Created3");
        }});
      }
     }
  });
  amqp.connect('amqp://localhost:5671', function(error,connection) {
  if(error != null)
  {
     throw error;
  }
  else
  {
     console.log("Connected");
     connection.createChannel(function(error,channel){
        if(error)
        {
           throw error;
        }
        else  {
        channel.assertQueue('register_service_queue',{
            exclusive : false
        });
        channel.consume('register_service_queue',function rply(msg){
           var obj = JSON.parse(msg.content.toString())
           console.log("Picked Up")
           var decoded = jwt.verify(obj, 'shhhhh');
           const result = Query(client,decoded,channel,msg);
          //  channel.sendToQueue(msg.properties.replyTo,Buffer.from("ok"),{
          //   });
          // channel.ack(msg);
        })  
      }
     })
    }
  });
}
database_fumctioning();