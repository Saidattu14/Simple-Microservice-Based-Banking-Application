## The Architecture

![appliaction_flow](https://github.com/Saidattu14/Simple-Microservice-Based-Banking-Application/blob/main/Flow/application_flow.png?raw=true)

## GraphQL Gateway

The GraphQL gateway accepts Incoming API requests and validates authentication where it eventually pushes the request in a particular message queue channel and waits for the response from the Node.js Server.
The gateway is also responsible for converting the request into a token, assigning message IDs for the API requests, reply channel information and metadata of the request.

## Responsible of the Microservices

It consumes the API request from the channel and validates the data using the database operations and replies using the message reply backchannel from the API request data.

## Register Account Services

The service authenticates and stores the user data in the database and responds with a token to provide access to other services.

## Login Account Services

The service validates and responds with a token to provide access to other services.

## Account Management Services

The service updates the user data and is also used to get user details information.

## Debit Management Services

The service debit the user requested amount and also get the last debit details information.

## Credit Management Services

The services credit the requested amount from the user account to the credit user account and also get the last credit details information.


## Node.js Server 

The server consumes the data from the reply back channels and responses to the GraphQL gateway and acknowledges the messages.


## A list of technologies used within the project:

* RabbitMQ
* PostgreSQL
* Docker
* GraphQL
* Node.js


