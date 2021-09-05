const Msg_reply = (channel,msg,obj) => {
    
    channel.sendToQueue(msg.properties.replyTo,Buffer.from(JSON.stringify(obj)),{
        contentType: 'application/json',
        correlationId: msg.properties.correlationId,
    });
    channel.ack(msg);
}
const Query_get = function sol(client,obj,channel,msg){
    console.log(obj)
    const query1 = {
      // give the query a unique id
      name: 'fetch-credituser_data',
      text: 'SELECT * FROM  CreditDetails_Information WHERE User_Account_Number = $1',
      values: [parseInt(obj.Account_number)],
    }
    client.query(query1,function(err,res1){
        if(err != null )
        {   
            Msg_reply(channel,msg,"CreditUser is InValid")
        }
        else
        {
            if(res1.rowCount == 0)
            {
                Msg_reply(channel,msg,"No Credit Transactions are done")
            }
            else
            {
                Msg_reply(channel,msg,res1.rows)
            }
        }
     });
    
  };
module.exports = Query_get;
