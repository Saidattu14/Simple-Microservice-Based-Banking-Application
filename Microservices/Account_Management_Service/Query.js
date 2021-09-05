const Msg_reply = (channel,msg,reply_data) => {
    var obj = {
        reply_msg : reply_data,
        
    }
    JSON.stringify(obj)
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
            Msg_reply(channel,msg,"Something is Wrong")
        }
        else
        {   if(obj.FirstName == null)
            {
             obj.FirstName = res.rows[0].FirstName
            }
            if(obj.LastName == null)
            {
                obj.LastName = res.rows[0].LastName
            }
            if(obj.Address == null)
            {
                obj.Address = res.rows[0].Address
            }
            if(obj.City == null)
            {
                obj.City = res.rows[0].City
            }
            if(obj.Password == null)
            {
                obj.Password = res.rows[0].Password
            }
            if(obj.MobileNumber == null)
            {
                obj.MobileNumber = res.rows[0].MobileNumber
            }
            const query2 = {
                // give the query a unique id
                name: 'update-userdata',
                text: 'UPDATE User_information SET LastName = $1, FirstName = $2,Address = $3, City= $4,Password = $5, MobileNumber = $6 Where PersonID = $7',
                values: [obj.LastName,obj.FirstName,obj.Address, obj.City,obj.Password,obj.MobileNumber,obj.PersonID],
            }
            client.query(query2,function(err,res){
                Msg_reply(channel,msg,"Account Details Updated Successfully")
            });
        }

     });
    client.query("SELECT * FROM User_Information",(err,res) => {
        console.log(res)
    });
    
  };
module.exports = Query;
