var amqp = require('amqplib/callback_api');
var logger = require('./logger')
const consumer = require('./consumer')
const bluebird = require('bluebird');
var express = require('express');
const morgan = require('morgan');
var app = express();
const rabbitmq_host =  process.env.rabbitmq;
app.use(morgan('combined', { stream: logger.stream }));

amqp.connect(rabbitmq_host, function(error,connection) {
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
         var obj = {};
         bluebird.promisifyAll(channel);
         channel.consume('getAccountDetails_reply_queue',function rply(msg){
            var obj1= JSON.parse(msg.content.toString());
            let id = msg.properties.correlationId;
           if(id != undefined)
           {
              obj[id] = obj1;
              console.log(obj1)
           }
           channel.ack(msg);
         });
         channel.consume('getCreditDetails_reply_queue',function rply(msg){
            let obj1= JSON.parse(msg.content.toString());       
            let id = msg.properties.correlationId;
           if(id != undefined)
           {
              obj[id] = obj1;
           }
           channel.ack(msg);
           console.log(obj)
         });
         channel.consume('getDebitDetails_reply_queue',function rply(msg){
            var obj1= JSON.parse(msg.content.toString());
            let id = msg.properties.correlationId;
           if(id != undefined)
           {
              obj[id] = obj1;
           }
           channel.ack(msg);
           
         });
         channel.consume('register_service_reply_queue',function rply(msg){
            var obj1= JSON.parse(msg.content.toString());
            let id = msg.properties.correlationId;
            if(id != undefined)
            {
               obj[id] = obj1;
            }
            channel.ack(msg);
         });
         channel.consume('login_service_reply_queue',function rply(msg){
            var obj1= JSON.parse(msg.content.toString());
            let id = msg.properties.correlationId;
            if(id != undefined)
            {
               obj[id] = obj1;
            }
            channel.ack(msg);
         });
         channel.consume('AccountManagement_service_reply_queue',function rply(msg){
            var obj1= JSON.parse(msg.content.toString());
            let id = msg.properties.correlationId;
            if(id != undefined)
            {
               obj[id] = obj1;
            }
            channel.ack(msg);
         });
         channel.consume('DebitAmount_service_reply_queue',function rply(msg){
            var obj1= JSON.parse(msg.content.toString());
            let id = msg.properties.correlationId;
            if(id != undefined)
            {
               obj[id] = obj1;
            }
            channel.ack(msg);
         });
         channel.consume('CreditAmount_service_reply_queue',function rply(msg){
            var obj1= JSON.parse(msg.content.toString());
            let id = msg.properties.correlationId;
            if(id != undefined)
            {
               obj[id] = obj1;
            }
            channel.ack(msg);
         });
         app.get('/queue', async(req,res) => {
            return res.status(200).json(obj);
         })
        app.listen(3000);
      }
   });
  }
})
