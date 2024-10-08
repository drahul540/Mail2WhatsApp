const route = require('express').Router();
const {getEmailDetailsWOCallback, getMessageList} = require('../utils/gmail/email');
const { setCredentials, authorize } = require('../utils/gmail/auth');
const gmailController = require('../controller/gmail.controller');
const { stopWatch, watchGmail } = require('../utils/gmail/watch');
const { google } = require('googleapis');
const cron = require('node-cron');

route.post('/webhook', (req, res) => {
    const data = req.body;
    // console.log('Received notification:', data);
    if (data.message && data.message.data) {
        const message = Buffer.from(data.message.data, 'base64').toString('utf-8');
        const messageData = JSON.parse(message);
        const historyId = messageData.historyId;

        console.log('Received notification: ',historyId)

        gmailController.latestMessage(historyId)

        res.send({status: 'success'})

    }
});

route.get('/start-watch', async (req, res) => {
    authorize((resData) => {
        
        if(resData.success){
            console.log('In Function:', resData)
            res.send(resData.auth);
        }else{
            console.log('In Watch:', resData)
            watchGmail(resData)
        }
        
         // Schedule the watch renewal every 6 days
         cron.schedule('0 0 */6 * *', () => {
            console.log('Renewing Gmail watch...');
            authorize(watchGmail);
        });
    },(err, response) => {
        console.log(response)
        if (err) return res.status(500).send(err);
        res.send('Watch started');
    })
});

route.get('/stop-watch', (req, res) => {
    authorize(stopWatch);
    res.send('Watch Stopped');
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