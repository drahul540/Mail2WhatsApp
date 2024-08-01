const route = require('express').Router();
const {getEmailDetails} = require('../utils/gmail/email');
const { setCredentials } = require('../utils/gmail/auth');

route.post('/webhook', (req, res) => {
    const data = req.body;
    console.log('Received notification:', data);

    if (data.message && data.message.data) {
        const message = Buffer.from(data.message.data, 'base64').toString('utf-8');
        const messageData = JSON.parse(message);
        const messageId = data.message.messageId;

        console.log('MSGDATA: ',messageId)

        getEmailDetails(messageId, (emailDetails) => {
            console.log('Email details:', emailDetails);
            // Process the email details here (e.g., send to WhatsApp)
        });
    }

    res.status(200).send({status: 'success'});
});

route.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;
    setCredentials(code);
    res.send('Authentication successful! You can close this window.');
});


module.exports = route