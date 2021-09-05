const Msg_reply = (channel,msg,obj) => {
   
    channel.sendToQueue(msg.properties.replyTo,Buffer.from(JSON.stringify(obj)),{
      contentType: 'application/json',
      correlationId: msg.properties.correlationId,
      expiration: '100',
    });
    channel.ack(msg);
}
const Query_get = function sol(client,obj,channel,msg){
    console.log(obj)
    const query1 = {
      // give the query a unique id
      name: 'fetch-userid_get',
      text: 'SELECT * FROM User_information WHERE PersonID = $1',
      values: [obj.PersonID],
    }
    client.query(query1,function(err,res){
        if(err != null )
        {   
            Msg_reply(channel,msg,"Something is Wrong")
        }
        else
        {   
           
           var json_data = {
            CurrentBalance : res.rows[0].currentbalance,
            CreatedDate  : res.rows[0].createddate,
            AccountNumber : res.rows[0].accountnumber,
            BranchCode  : res.rows[0].branchcode,
            PersonID : res.rows[0].personid,
            LastName : res.rows[0].lastname,
            FirstName : res.rows[0].firstname,
            Address   : res.rows[0].address,
            City     : res.rows[0].city,
            UserName : res.rows[0].username,
            MobileNumber : res.rows[0].mobilenumber,
           }
           Msg_reply(channel,msg,json_data)
        }

     });
     client.query("SELECT * FROM User_Information",(err,res) => {
        console.log(res)
    });
    
  };
module.exports = Query_get;
