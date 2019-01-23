const TelegramBot = require('node-telegram-bot-api');

// replace token the value from @BotFather
const token = '710809106:AAElhVvKD1r5BAKXZMTBW61BU0-M-dcQ-jM';
const reworkai_bot = new TelegramBot(token, {polling: true});

// get api from dialogflow
const projectId = 'telegram-bot-a5a3d'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'quickstart-session-id';
const query = 'hello';
const languageCode = 'en-US';

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// The text query request.
const request = {
    session: sessionPath,
    queryInput: {
        text: {
            text: query,
            languageCode: languageCode,
        },
    },
};

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// send message and response
reworkai_bot.on('message', (msg) => {
    console.log(msg.text)
    request.queryInput.text.text= msg.text
    sessionClient
        .detectIntent(request)
        .then(responses => {
            console.log('Detected intent');
            const result = responses[0].queryResult;
            console.log(`  Query: ${result.queryText}`);
            console.log(`  Response: ${result.fulfillmentText}`);
            // send message
            reworkai_bot.sendMessage(msg.chat.id, result.fulfillmentText);
            if (result.intent) {
                console.log(`  Intent: ${result.intent.displayName}`);
            } else {
                console.log(`  No intent matched.`);
            }
        })
        .catch(err => {
            console.error('ERROR:', err);
        });

});
// Send request and log result

