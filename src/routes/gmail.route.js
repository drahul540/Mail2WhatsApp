const route = require('express').Router();
const {getEmailDetailsWOCallback, getMessageList} = require('../utils/gmail/email');
const { setCredentials } = require('../utils/gmail/auth');
const gmailController = require('../controller/gmail.controller');

route.post('/webhook', (req, res) => {
    const data = req.body;
    // console.log('Received notification:', data);
    if (data.message && data.message.data) {
        const message = Buffer.from(data.message.data, 'base64').toString('utf-8');
        const messageData = JSON.parse(message);
        const historyId = messageData.historyId;

        console.log('Received notification: ',historyId)

        gmailController.latestMessage()

    }
});

route.get('/webhook/start', async (req, res) => {
   
    res.send('Watch request started.');
});

route.get('/webhook/stop', async (req, res) => {
   
    res.send('Watch request stopped.');
});

route.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    setCredentials(code);
    res.send('Authentication successful! You can close this window.');
});

route.get('/message/list', (req, res) => {
    getMessageList((resData)=>{
        res.send(resData);
    })
})

route.get('/email/content', async (req, res) => {
    const { id } = req.query;
    getEmailDetailsWOCallback(id, (emailDetails) => {
        // const dataBuffer = Buffer.from(emailDetails, 'base64');
        // const decodedData = JSON.parse(dataBuffer.toString('utf8'));
        // console.log('Email details:', emailDetails);
        res.send(emailDetails);
        // Process the email details here (e.g., send to WhatsApp)
    });
    // res.send('Authentication successful! You can close this window.');
});

module.exports = route