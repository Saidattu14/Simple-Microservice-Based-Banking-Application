const BranchCode = "ALD2114"
const AccountNumber = 1000000
const CurrentBalance = 1000
var jwt = require('jsonwebtoken');
const Msg_reply = (channel,msg,reply_data,token) => {
    var obj = {
        reply_msg : reply_data,
        token : token,
    }
    channel.sendToQueue(msg.properties.replyTo,Buffer.from(JSON.stringify(obj)),{
      contentType: 'application/json',
      correlationId: msg.properties.correlationId,
      expiration: '100',
    });
    channel.ack(msg);
}
const userdata_creation = (client,obj,channel,msg) => {
  var Acc_no = AccountNumber
  var token = null;
  client.query('SELECT * from User_information', function (err,res){
     if(err == null)
     {
      Acc_no = Acc_no + res.rowCount;
      token = {
        id : jwt.sign(obj.PersonID, 'shhhhh'),
        no : jwt.sign(Acc_no, 'shhhhh')
      }
      token = jwt.sign(token, 'shhhhh');
      const now = new Date()
      const query4 = {
        // give the query a unique name
        name :'insert-user',
        text: 'INSERT INTO User_information(PersonID, LastName,FirstName,UserName,Password,MobileNumber,AccountNumber,BranchCode,Address,City,CurrentBalance,CreatedDate,Deleteddate) VALUES($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)',
        values: [obj.PersonID,obj.LastName,obj.FirstName, obj.UserName,obj.Password,obj.MobileNumber,Acc_no,BranchCode,obj.Address,obj.City,CurrentBalance,now,null],
      }
      client.query(query4,function(err,res){
        if(err)
        {
            console.log(err)
            Msg_reply(channel,msg,"Invalid Input",null);
        }
        else
        {  
        Msg_reply(channel,msg,"UserAccount Successfully Created",token)
        }
      })
     }
  })
}
const Query = function sol(client,obj,channel,msg){
  var rest = 1;
  console.log(obj)
  const query1 = {
    // give the query a unique id
    name: 'fetch-userid',
    text: 'SELECT * FROM User_information WHERE PersonID = $1',
    values: [obj.PersonID],
  }
  const query2 = {
    // give the query a unique name
    name: 'fetch-username',
    text: 'SELECT * FROM User_information WHERE UserName = $1',
    values: [obj.UserName],
   }
   const query3 = {
    name: 'fetch-usernumber',
    text: 'SELECT * FROM User_information WHERE MobileNumber = $1',
    values: [obj.MobileNumber],
   }
    client.query(query1,function(err,res){
      if(err != null || res.rowCount != 0)
      {
       
       Msg_reply(channel,msg,"PersonID is Already Exits",null)
       rest = 0;
      }
    });
    client.query(query2,function(err,res){
        if(rest != 0)
        {
        if(err != null || res.rowCount != 0)
        {
         Msg_reply(channel,msg,"UserName is Already Exits",null)
         rest = 0;
        }}
        
    });
    client.query(query3,function(err,res){
       if(rest != 0)
       {
        if(err != null || res.rowCount != 0)
        {
         Msg_reply(channel,msg,"MobileNumber is Already Exits",null)
        }
        else
        {
          userdata_creation(client,obj,channel,msg);
        }
      }
    });
    client.query("SELECT * FROM User_Information",(err,res) => {
      console.log(res,err)
    })
};
module.exports = Query;