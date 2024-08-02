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
            console.log('RESData: ',res.data)
            callback(res.data);
        });
    })
    
}

function getMessageList(callback){
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    gmail.users.messages.list({userId: 'me'}, (err, res)=>{
        if (err) return console.error('Error getting message list:', err);
            console.log('RESData: ',res.data)
            callback(res.data);
    })
}

function base64UrlDecode(base64Url) {
    // Replace URL-safe characters with standard Base64 characters
    base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Pad with '=' characters to make the length a multiple of 4
    while (base64Url.length % 4) {
        base64Url += '=';
    }
    
    // Decode the Base64 string
    const decodedString = Buffer.from(base64Url, 'base64').toString('utf8');
    
    return decodedString;
}

function decodeBase64Url(base64url) {
    
    const base64 = base64url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
  
    return Buffer.from(base64, 'base64')
  }

function getEmailDetailsWOCallback(messageId, callback) {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    gmail.users.history.list((err, resp)=>{
        gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'raw'
        }, (err, res) => {
            if (err) return console.error('Error getting email details:', err);
            const decoded = decodeBase64Url(res.data);
            callback(decoded)
        });
    })
    
}

module.exports = { getEmailDetails, getEmailDetailsWOCallback, getMessageList };
