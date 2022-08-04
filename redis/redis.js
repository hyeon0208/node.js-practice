const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');

/* redis version 3.1.2 */
/* npm install redis@^3.1.2 */

client.get('myKey', (err, value) => {
    console.log(value);
});

// 4 이상 버전.
//async function run(){
//     await client.connect()
// }

// run();

// async function getVal(key){
//     const item = await client.lRange(key, 0, -1);
//     console.log(item);
// }

// getVal("myKey");