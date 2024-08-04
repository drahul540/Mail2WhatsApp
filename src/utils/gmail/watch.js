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

function start(){
    authorize((auth)=>{
        watchGmail(auth);
    })
    
}

function stop(){
    authorize((auth)=>{
        const gmail = google.gmail({version: 'v1', auth: auth});
        const userId = 'me';

        gmail.users.stop({userId});
    })
    
}

module.exports = { watchGmail, start, stop };
