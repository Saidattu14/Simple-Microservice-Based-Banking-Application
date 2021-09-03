import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken'
import gettoken from '../Auth/Token_Verify'
const producer = require('./producer')
const consumer = require('./consumer')
const Query = {
    async get_Account_Management_Service(parent,args,{channel,pubsub,request,logger},info) {
        var data = gettoken(request,args.input.PersonID);
        if(data != null)
        {
        var json_data = {
            PersonID : args.input.PersonID,
            Details : "Get Details"
        }
        let id = uuidv4();
        json_data = jwt.sign(json_data, 'shhhhh');
        producer(channel,json_data,'getAccountDetails_queue','getAccountDetails_reply_queue',id);
        let b =  consumer(id,logger);
        return b;
        }
        else
        {
            return null;
        }
    },
    get_CreditDetails(parent,args,{channel,pubsub,request},info) {
        var data = gettoken(request,args.input.Account_number);
        if(data != null)
        {
        var json_data = {
            Account_number : args.input.Account_number,
            Details : "Get Credit_Details"
        }
        let id = uuidv4();
        json_data = jwt.sign(json_data, 'shhhhh');
        producer(channel,json_data,'getCreditDetails_queue','getCreditDetails_reply_queue',id);
        let b =  consumer(id);
        return b;
        }
    },
    get_DebitDetails(parent,args,{channel,pubsub,request},info)
    {
        var data = gettoken(request,args.input.Account_number);
        if(data != null)
        {
        var json_data = {
            Account_number : args.input.Account_number,
            Details : "Get Credit_Details"
        }
        let id = uuidv4();
        json_data = jwt.sign(json_data, 'shhhhh');
        producer(channel,json_data,'getDebitDetails_queue','getDebitDetails_reply_queue',id);
        let b =  consumer(id);
        return b;
       }
    }
}
export { Query as default }