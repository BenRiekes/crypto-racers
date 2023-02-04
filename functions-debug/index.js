// set up dotenv
import { CronJob } from "cron";

const INTERVAL = '1 * * * * *'
const FUNCTION_URL = 'http://127.0.0.1:5001/crypto-racers/us-central1/matchmakingRunner';

new CronJob(INTERVAL, async function() {
    console.log('\nCalling function...');
    const response = await fetch(FUNCTION_URL, {
        method: 'GET',
    });
    console.log('Response:\n', response);
    
}, null, true, 'America/Los_Angeles');

console.log("Starting job...");