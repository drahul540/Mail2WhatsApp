const {google} = require('googleapis');
const {oAuth2Client} = require('./auth');
const { simpleParser } = require('mailparser');

function getEmailDetails(historyId, callback) {
    const gmail = google.gmail({version: 'v1', auth: oAuth2Client});
    gmail.users.history.list({userId: 'me', startHistoryId: historyId},(err, resp)=>{
        console.log('RESData: ',resp.data)
        // gmail.users.messages.get({
        //     userId: 'me',
        //     id: messageId
        // }, (err, res) => {
        //     if (err) return console.error('Error getting email details:', err);
        //     console.log('RESData: ',res.data)
        //     callback(res.data);
        // });
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
    base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Url.length % 4) {
        base64Url += '=';
    }
    const decodedString = Buffer.from(base64Url, 'base64').toString('utf8');
    return decodedString;
}

function decodeAndParseEmail(raw, callback) {
    try {
        const decodedString = base64UrlDecode(raw);
        simpleParser(decodedString, (err, parsedEmail) => {
            if (err) {
                return callback(err);
            }
            callback(null, parsedEmail);
        });
    } catch (error) {
        callback(error);
    }
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
            decodeAndParseEmail(res.data.raw, (error, emailData) => {
                if (error) {
                    return callback(error);
                }
                callback(emailData);
            });
        });
    })
    
}

module.exports = { getEmailDetails, getEmailDetailsWOCallback, getMessageList };
