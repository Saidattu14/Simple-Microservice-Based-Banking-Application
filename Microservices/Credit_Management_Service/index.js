const {Client} = require('pg');
var amqp = require('amqplib/callback_api');
var Query = require('./Query')
var Query_get = require('./Query_get')
var jwt = require('jsonwebtoken');
const client = new Client({
    user: 'user',
    host: 'localhost',
    password: '123456',
    port: 5431,
    database : 'default_database'
  })
  try {
    client.connect()
  } catch (error) {
    console.log("DataBase is not Connected")
}
const services = async() => {
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
        else  
        {
        channel.assertQueue('CreditAmount_service_queue',{
            exclusive : false
        });
        channel.consume('CreditAmount_service_queue',function rply(msg){
           var obj = JSON.parse(msg.content.toString())
           obj = jwt.verify(obj, 'shhhhh');
           const result = Query(client,obj,channel,msg);
          //  channel.sendToQueue(msg.properties.replyTo,Buffer.from("ok"),{
          //   });
          // channel.ack(msg);
        })
        channel.assertQueue('getCreditDetails_queue',{
          exclusive : false
      });
        channel.consume('getCreditDetails_queue',function rply(msg){
          var obj = JSON.parse(msg.content.toString())
          obj = jwt.verify(obj, 'shhhhh');
          const result = Query_get(client,obj,channel,msg);
         //  channel.sendToQueue(msg.properties.replyTo,Buffer.from("ok"),{
         //   });
         // channel.ack(msg);
       })
      }
     })
    }
  });
}
services()