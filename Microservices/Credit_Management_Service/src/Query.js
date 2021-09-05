const Transaction_id = 140500000
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
      name: 'fetch-credituser',
      text: 'SELECT * FROM User_information WHERE PersonID = $1',
      values: [obj.Credit_Account_PersonID],
    }
    const query2 = {
        // give the query a unique id
        name: 'fetch-user',
        text: 'SELECT * FROM User_information WHERE AccountNumber = $1',
        values: [parseInt(obj.User_Account_Number)],
    }
    client.query(query1,function(err,res1){
        if(err != null )
        {   console.log(err)
            Msg_reply(channel,msg,"CreditUser is InValid")
        }
        else
        {
            client.query(query2,function(err,res2)
            {
                if(err != null )
                {
                    Msg_reply(channel,msg,"UserAccount is InValid")
                }
                else
                {
                    if(res2.rows[0].password == obj.Password)
                   {
                        if(parseInt(obj.Amount) > res2.rows[0].currentbalance || obj.Confrim != true)
                        {
                            Msg_reply(channel,msg,"Please Check the Amount and Confrim It")
                        }
                        else
                        {
                            const query3 = {
                                // give the query a unique id
                                name: 'update-Debit_user',
                                text: 'UPDATE User_information SET CurrentBalance = $2 WHERE AccountNumber = $1',
                                values: [parseInt(obj.User_Account_Number),res2.rows[0].currentbalance - parseInt(obj.Amount)],
                            }
                            const query4 = {
                                name: 'update-Credit',
                                text: 'UPDATE User_information SET CurrentBalance = $2 WHERE AccountNumber = $1',
                                values: [parseInt(obj.Credit_Account_Number),res1.rows[0].currentbalance + parseInt(obj.Amount)],
                            }
                            client.query(query3,function(err,res3){
                                if(err)
                                {
                                    console.log(err)
                                    Msg_reply(channel,msg,"Error Occurred")
                                }
                                else
                                {
                                client.query(query4,function(err,res4){
                                    if(err)
                                    {
                                        console.log(err)
                                        Msg_reply(channel,msg,"Error Occurred")
                                    }
                                    else
                                    {
                                        
                                    client.query("SELECT * FROM CreditDetails_Information",(err,res) => {
                                        const now = new Date()
                                        var no = Transaction_id + res.rowCount;
                                        const inst = {
                                                // give the query a unique name
                                            name :'insert-user',
                                            text: 'INSERT INTO CreditDetails_Information(Credit_Account_PersonID,Credit_Account_Number,User_Account_Number,Amount,CreatedDate,Transaction_id) VALUES($1, $2,$3,$4,$5,$6)',
                                            values: [obj.Credit_Account_PersonID,parseInt(obj.Credit_Account_Number),parseInt(obj.User_Account_Number),parseInt(obj.Amount),now,no],
                                        }
                                        client.query(inst,function(err,res4){
                                            if(err)
                                            {
                                                console.log(err)
                                                Msg_reply(channel,msg,"Transaction Done Successfully")
                                                
                                            }
                                            else
                                            {
                                                Msg_reply(channel,msg,"Transaction Done Successfully")
                                            }
                                        }) 
                                    });
                                        
                                    }
                                })
                            }
                        })
                    }
                   }
                   else
                   {
                    Msg_reply(channel,msg,"Password was Incorrect")
                   }
                }
            })
        }
     });
    
  };
module.exports = Query;
