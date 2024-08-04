const {google} = require('googleapis');
const {oAuth2Client, authorize} = require('./auth');
const {TOPIC_NAME} = require('../../config/config');

function watchGmail(auth) {
    const gmail = google.gmail({version: 'v1', auth: auth});
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

function stopWatch(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    gmail.users.stop({
        userId: 'me',
    }, (err, response) => {
        if (err) {
            if (err.response) {
                console.error('Error stopping Gmail watch:', err.response.data);
            } else {
                console.error('Error stopping Gmail watch:', err.message);
            }
        } else {
            console.log('Gmail watch stopped:', response.data);
        }
    });
}


module.exports = { watchGmail, stopWatch };
