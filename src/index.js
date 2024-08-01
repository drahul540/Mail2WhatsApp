//require("./db/connection");
const express = require('express');
const cors = require("cors");
const responseTime = require('response-time')
const moment = require('moment-timezone')

const cron = require('node-cron');
const {authorize} = require('./utils/gmail/auth');
const {watchGmail} = require('./utils/gmail/watch');

moment.tz.setDefault('UTC');

// express setup
const app = express()
app.use(express.json())
app.use(responseTime());

// Cors setup
var corsOptions = {
    origin: process.env.CLIENT_HOME_PAGE_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));

// Routes
app.get('/', (req, res)=>{
    res.send("Server Running...)");
})

app.use('/gmail', require('./routes/gmail.route'))


// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    authorize((auth) => {
        watchGmail(auth);
        // Schedule the watch renewal every 6 days
        cron.schedule('0 0 */6 * *', () => {
            console.log('Renewing Gmail watch...');
            authorize(watchGmail);
        });
    });
});