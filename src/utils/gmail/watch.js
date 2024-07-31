const {google} = require('googleapis');
const {oAuth2Client} = require('./auth');
const {TOPIC_NAME} = require('../../config/config');

function watchGmail() {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    const userId = 'me';
    const request = {
        userId: userId,
        requestBody: {
            labelIds: ['INBOX'],
            topicName: TOPIC_NAME
        }
    };

    gmail.users.watch(request, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        console.log('Watch response:', res.data);
    });
}

module.exports = { watchGmail };
