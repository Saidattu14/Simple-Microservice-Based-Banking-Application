import { GraphQLServer, PubSub } from 'graphql-yoga'
import Query from './resolvers/Query'
import {Mutation} from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'

const redis = require('redis');
const Queue = require('../src/resolvers/Queue')
const bluebird = require('bluebird');
const logger = require('./resolvers/logger')
const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan('combined', { stream: logger.stream }));
const client = {
    host: 'localhost',
    port : 6379,
    no_ready_check: true,
}
const ct = redis.createClient(client)
bluebird.promisifyAll(ct);
var amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost:5671', function(error,connection)
{
    connection.createChannel(function(error,channel)
    {
        if(error)
        {
           throw error;
        }
        else
        {
            Queue(channel);
            const pubsub = new PubSub()
            const server = new GraphQLServer({
            typeDefs: './src/schema.graphql',
            resolvers: {
                Query,
                Mutation,
                Subscription,
            },
            context(request) {
                return{
                pubsub,
                channel,
                request,
                connection,
            }},
            })
            server.start(function()
            {
            console.log("Server started")
        })}
  })
})