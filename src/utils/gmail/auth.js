const {OAuth2Client} = require('google-auth-library');
const fs = require('fs');
const readline = require('readline');
const {CLIENT_ID, CLIENT_SECRET, REDIRECT_URI} = require('../../config/config');
const { watchGmail } = require('./watch');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

function authorize(callback) {
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            getNewToken(oAuth2Client, callback);
        } else {
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        }
    });
}

function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    callback(false)
    // const rl = readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    // });
    // rl.question('Enter the code from that page here: ', (code) => {
    //     rl.close();
    //     oAuth2Client.getToken(code, (err, token) => {
    //         if (err) return console.error('Error retrieving access token', err);
    //         oAuth2Client.setCredentials(token);
    //         fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    //             if (err) console.error(err);
    //             console.log('Token stored to', TOKEN_PATH);
    //         });
    //         callback(oAuth2Client);
    //     });
    // });
}

function setCredentials(code) {
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) console.error(err);
            console.log('Token stored to', TOKEN_PATH);
            watchGmail(oAuth2Client)
        });
    });
}

module.exports = { oAuth2Client, authorize, setCredentials };
