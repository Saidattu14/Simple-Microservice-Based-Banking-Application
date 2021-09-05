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
      name: 'fetch-debituser',
      text: 'SELECT * FROM  DebitDetails_Information WHERE Account_Number = $1',
      values: [parseInt(obj.Account_number)],
    }
    client.query(query1,function(err,res1){
        if(err != null )
        {   
            Msg_reply(channel,msg,"User is InValid")
        }
        else
        {
            if(res1.rowCount == 0)
            {
                Msg_reply(channel,msg,"No Debit Transactions are done")
            }
            else
            {
                Msg_reply(channel,msg,res1.rows)
            }
            console.log(res1.rows)
           
        }
     });
    
  };
module.exports = Query_get;
