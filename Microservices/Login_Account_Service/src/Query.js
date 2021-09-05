var jwt = require('jsonwebtoken');
const Msg_reply = (channel,msg,reply_data,token) => {
    var obj = {
        reply_msg : reply_data,
        token : token
    }
    channel.sendToQueue(msg.properties.replyTo,Buffer.from(JSON.stringify(obj)),{
        contentType: 'application/json',
        correlationId: msg.properties.correlationId,
        expiration: '100',
    });
    channel.ack(msg);
}
const Query = function sol(client,obj,channel,msg){
    console.log(obj)
    const query1 = {
      // give the query a unique id
      name: 'fetch-userid',
      text: 'SELECT * FROM User_information WHERE PersonID = $1',
      values: [obj.PersonID],
    }
    client.query(query1,function(err,res){
        if(err != null )
        {   
            Msg_reply(channel,msg,"PersonID is InValid",null)
        }
        else
        {
           if(res.rowCount == 0)
           {
            Msg_reply(channel,msg,"PersonID is InValid",null);
           }
           else
           {
            if(res.rows[0].username == obj.UserName)
            {
                if(res.rows[0].password == obj.Password)
                {
                    var token = {
                        id : jwt.sign(obj.PersonID, 'shhhhh'),
                        no : jwt.sign(parseInt(res.rows[0].accountnumber), 'shhhhh')
                        
                    }
                    token = jwt.sign(token, 'shhhhh');
                    Msg_reply(channel,msg,"Login Done Successfully",token);
                }
                else
                {
                    Msg_reply(channel,msg,"Password was Incorrect",null)
                }
            }
            else
            {
                Msg_reply(channel,msg,"UserName was Incorrect",null)
            }
           } 
        }
     });
    // client.query("SELECT * FROM User_Information",(err,res) => {
    //     // console.log(res)
    // });
  };
module.exports = Query;
