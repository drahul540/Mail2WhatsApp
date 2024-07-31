const route = require('express').Router();
const {getEmailDetails} = require('../utils/gmail/email');

route.post('/webhook', (req, res) => {
    const data = req.body;
    console.log('Received notification:', data);

    if (data.message && data.message.data) {
        const message = Buffer.from(data.message.data, 'base64').toString('utf-8');
        const messageData = JSON.parse(message);
        const messageId = messageData.email;

        getEmailDetails(messageId, (emailDetails) => {
            console.log('Email details:', emailDetails);
            // Process the email details here (e.g., send to WhatsApp)
        });
    }

    res.status(200).send({status: 'success'});
});


module.exports = route