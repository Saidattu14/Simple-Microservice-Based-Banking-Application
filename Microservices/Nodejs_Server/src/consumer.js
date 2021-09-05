const consumer = async(channel) => {
    let pr = new Promise(async(resolve,reject) => {
            channel.consume('register_service_reply_queue',function rply(msg){
                   channel.ack(msg);
                   resolve(msg);
            });
        });
    return pr;
}
module.exports = consumer;
