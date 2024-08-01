const {google} = require('googleapis');
const {oAuth2Client} = require('./auth');

function getEmailDetails(messageId, callback) {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    gmail.users.history.list((err, resp)=>{
        gmail.users.messages.get({
            userId: 'me',
            id: messageId
        }, (err, res) => {
            if (err) return console.error('Error getting email details:', err);
            callback(res.data);
        });
    })
    
}

function getEmailDetailsWOCallback(messageId) {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    gmail.users.history.list((err, resp)=>{
        gmail.users.messages.get({
            userId: 'me',
            id: messageId
        }, (err, res) => {
            if (err) return console.error('Error getting email details:', err);
        });
    })
    
}

module.exports = { getEmailDetails, getEmailDetailsWOCallback };
