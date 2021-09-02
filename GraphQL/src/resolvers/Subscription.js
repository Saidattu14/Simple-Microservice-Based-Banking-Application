const Subscription = {
    CreditMessage : {
        subscribe(parent, args, { pubsub ,channel}, info) 
        {
            
       const val = {
        PersonID :  args.input.PersonID,
        LastName : args.input.LastName,
        FirstName : args.input.FirstName,
        Address   : args.input.Address,
        City     : args.input.City,
        UserName :  args.input.UserName,
        Password : args.input.Password,
        MobileNumber : args.input.MobileNumber,
       }
       
       channel.sendToQueue('register_service_queue',Buffer.from(JSON.stringify(val)),{
        deliveryMode: 1,
        replyTo : 'register_service_reply_queue',
        expiration: '50000',
        },{
            
        });
        channel.consume('register_service_reply_queue',function (error){
            pubsub.publish('post', {
                reply_msg : "Cool",
                token :"s"
              });
            if(error)
            {
                return error;

            }
            else
            {
                return "ok";
            }
        },{
            ack : true,
        })
        var obj = {
            reply_msg : "Cool",
            token :"s"
        }
       
    
        return pubsub.asyncIterator('post')
        }

    },
    DebitMessage : {
        subscribe(parent, args, { pubsub }, info) 
        {
            return pubsub.asyncIterator('post')
        }

    }
}

export { Subscription as default }