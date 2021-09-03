import { error } from 'npmlog';
import uuidv4 from 'uuid/v4'
import gettoken from '../Auth/Token_Verify'
import logger from './logger';
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
var jwt = require('jsonwebtoken');
const producer = require('./producer')
const consumer = require('./consumer')
const Mutation = {
    async registerAccount(parent,args,{channel,pubsub,connection,logger},info)
    {
            let json_data = {
                PersonID :  args.input.PersonID,
                LastName :  args.input.LastName,
                FirstName : args.input.FirstName,
                Address   : args.input.Address,
                City     :  args.input.City,
                UserName :  args.input.UserName,
                Password :  args.input.Password,
                MobileNumber : args.input.MobileNumber,
               }
               let id = uuidv4();
               json_data = jwt.sign(json_data, 'shhhhh');
               producer(channel,json_data,'register_service_queue','register_service_reply_queue',id);
               let b =  consumer(id,logger);
               return b;
               
    },
    async createLogin(parent, args, {pubsub, channel,logger}, info) {
        let json_data = {
            PersonID : args.input.PersonID,
            UserName : args.input.UserName,
            Password : args.input.Password
        }
        let id = uuidv4();
        json_data = jwt.sign(json_data, 'shhhhh');
        producer(channel,json_data,'login_service_queue','login_service_reply_queue',id);
        let b =  consumer(id,logger);
        return b;
    },
    updateAccount(parent, args, { db,channel,request,logger}, info) {
        var data = gettoken(request,args.input.PersonID);
        console.log(data)
        if(data != null)
        {
        let json_data = {
        PersonID : args.input.PersonID,
        LastName :  args.input.LastName,
        FirstName : args.input.FirstName,
        Address   : args.input.Address,
        City     :  args.input.City,
        Password :  args.input.Password,
        MobileNumber : args.input.MobileNumber,
        }
        let id = uuidv4();
        json_data = jwt.sign(json_data, 'shhhhh');
        producer(channel,json_data,'AccountManagement_service_queue','AccountManagement_service_reply_queue',id);
        let b =  consumer(id,logger);
        return b;
       }
       else
       {
        let obj = {
            reply_msg : 'Login or Register must be done first'
        }
        return obj;
       }
    },
    creditAmount(parent, args,{db,channel,request,logger}, info) {
        var data = gettoken(request,args.input.User_Account_Number);
        if(data != null)
        {
        let json_data = {
            Credit_Account_PersonID : args.input.Credit_Account_PersonID,
            Credit_Account_Number :args.input.Credit_Account_Number,
            Amount : args.input.Amount,
            User_Account_Number : args.input.User_Account_Number,
            Password : args.input.Password,
            Confrim : args.input.Confrim,
        }
        let id = uuidv4();
        json_data = jwt.sign(json_data, 'shhhhh');
        producer(channel,json_data,'CreditAmount_service_queue','CreditAmount_service_reply_queue',id);
        let b =  consumer(id,logger);
        return b;
       }
       else
       {
           let obj = {
               result : 'Login or Register must be done first'
           }
           return obj;
       }

    },
    debitAmount(parent, args, { db,channel,request,logger }, info) {
        var data = gettoken(request,args.input.Account_number);
        if(data != null)
        {
        let json_data = {
            Account_number : args.input.Account_number,
            Amount : args.input.Amount,
            Password : args.input.Password,
            Confrim : args.input.Confrim,
        }
        let id = uuidv4();
        json_data = jwt.sign(json_data, 'shhhhh');
        producer(channel,json_data,'DebitAmount_service_queue', 'DebitAmount_service_reply_queue',id);
        let b =  consumer(id,logger);
        return b;
       }
       else
       
       {
        let obj = {
            result : 'Login or Register must be done first'
        }
        return obj;
       }
    },

}
module.exports = {Mutation}