Firebase PubSub does not support scheduled functions in emulator mode. To allow for
testing of the matchmakingRunner function, this basically just calls that function
at a given crontask time. You can adjust how often this happens by setting the INTERVAL
function in index.js. Make sure the FUNCTION_URL is set to the url of the onRequest
function to call.