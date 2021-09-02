const Queue = async function sol(channel) {
    channel.assertQueue('register_service_queue',{
        durable : true,
        auto_delete : true
    });
    channel.assertQueue('register_service_reply_queue',{
        durable : true,
    });
    channel.assertQueue('login_service_queue',{
        durable : true,
        auto_delete : true
    });
    channel.assertQueue('login_service_reply_queue',{
        durable : true,
    });
    channel.assertQueue('AccountManagement_service_queue',{
        durable : true,
        auto_delete : true
    });
    channel.assertQueue('AccountManagement_service_reply_queue',{
        durable : true,
    });
    channel.assertQueue('DebitAmount_service_queue',{
        durable : true,
        auto_delete : true
    });
    channel.assertQueue('DebitAmount_service_reply_queue',{
        durable : true,
    });
    channel.assertQueue('CreditAmount_service_queue',{
        durable : true,
        auto_delete : true
    });
    channel.assertQueue('CreditAmount_service_reply_queue',{
        durable : true,
    });
    channel.assertQueue('getAccountDetails_queue',{
        durable : true,
        auto_delete : true
    });
    channel.assertQueue('getAccountDetails_reply_queue',{
        durable : true,
    });
    channel.assertQueue('getCreditDetails_queue',{
        durable : true,
        auto_delete : true
    });
    channel.assertQueue('getCreditDetails_reply_queue',{
        durable : true,
    });
    channel.assertQueue('getDebitDetails_queue',{
        durable : true,
        auto_delete : true
    });
    channel.assertQueue('getDebitDetails_reply_queue',{
        durable : true,
    });
}
module.exports = Queue;