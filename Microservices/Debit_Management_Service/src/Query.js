const Transaction_id = 14210000
const Msg_reply = (channel,msg,reply_data) => {
    var obj = {
        reply_msg : reply_data
    }
    console.log(obj)
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
      text: 'SELECT * FROM User_information WHERE AccountNumber = $1',
      values: [parseInt(obj.Account_number)],
    }

    client.query("SELECT * FROM User_Information",(err,res) => {
        console.log(res)
    });
    client.query(query1,function(err,res){
        if(err != null )
        {   
            Msg_reply(channel,msg,"Account Number is InValid")
        }
        else
        {
           if(res.rowCount == 0)
           {
            Msg_reply(channel,msg,"Account Number is InValid");
           }
           else
           {
            if(res.rows[0].password == obj.Password)
            {
                if(parseInt(obj.Amount) > res.rows[0].currentbalance || obj.Confrim != true)
                {
                    Msg_reply(channel,msg,"Please Check the Amount and Confrim It")
                }
                else
                {
                    const query2 = {
                        // give the query a unique id
                        name: 'update-Debit',
                        text: 'UPDATE User_information SET CurrentBalance=$2 WHERE AccountNumber = $1',
                        values: [parseInt(obj.Account_number),res.rows[0].currentbalance - parseInt(obj.Amount)],
                    }

                    client.query(query2,function(err,res){
                         if(err != null)
                         {
                            Msg_reply(channel,msg,"Error occurred")
                         }
                         else
                         {
                            
                            client.query("SELECT * FROM DebitDetails_Information",(err,res) => {
                                const now = new Date()
                                var no = Transaction_id + res.rowCount;
                                const inst = {
                                    // give the query a unique name
                                    name :'insert-user',
                                    text: 'INSERT INTO DebitDetails_Information(Account_Number,Amount,CreatedDate,Transaction_id) VALUES($1, $2,$3,$4)',
                                    values: [parseInt(obj.Account_number),parseInt(obj.Amount),now,no],
                                }
                                client.query(inst,function(err,res4){
                                    if(err)
                                    {
                                        console.log(err)
                                    }
                                    else
                                    {
                                      Msg_reply(channel,msg,"Amount Debited Successfully")
                                    }
                                }) 
                            });
                            
                         }
                    })
                } 
            }
            else
            {
                Msg_reply(channel,msg,"Password was Incorrect")
            }
           }
           
        }
     });
    client.query("SELECT * FROM User_Information",(err,res) => {
        console.log(res)
    });
  };
module.exports = Query;
