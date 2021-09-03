const producer = async(channel,json_data,queue_name,queue_reply,correlationId) => {
    channel.sendToQueue(queue_name,Buffer.from(JSON.stringify(json_data)),{
        deliveryMode: 1,
        replyTo : queue_reply,
        expiration: '100',
        contentType: 'application/json',
        correlationId : correlationId,
    },);
}
module.exports = producer;