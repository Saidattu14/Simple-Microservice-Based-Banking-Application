const fetch = require('node-fetch');
const consumer = async(id) => {
    let pr = new Promise((resolve,reject) => {
        
            setTimeout(async function(){
                const data = await fetch(
                    "http://localhost:3000/queue"
                ).catch(
                    function(err)
                    {
                        console.log(err)
                        return null;
                    }
                );
                if(data != null)
                {
                    let response = await data.json();
                    console.log(response[id]);
                    resolve(response[id]);
                }
                
            }, 1000);
        
           
        });
    return pr;
}
module.exports = consumer;
