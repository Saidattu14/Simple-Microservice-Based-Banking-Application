const fetch = require('node-fetch');
const consumer = async(id,logger) => {
    let pr = new Promise((resolve,reject) => {
            setTimeout(async function(){
                const data = await fetch(
                    "http://localhost:3000/queue"
                ).catch(
                    function(err)
                    {
                        logger.log({
                            level: 'error',
                            message: err,
                        });
                        resolve(null);
                        return null;
                    }
                );
            
                if(data != null && data.status == 200)
                {
                    let response = await data.json();
                    console.log(response[id]);
                    resolve(response[id]);
                }
                else
                {
                    logger.log({
                        level: 'error',
                        message: data,
                    });
                    resolve(null);
                    return null;
                }
            }, 1000);
        });
    return pr;
}
module.exports = consumer;
