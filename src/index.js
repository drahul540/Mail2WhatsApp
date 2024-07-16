require("./db/connection");
const express = require('express');
const cors = require("cors");
const responseTime = require('response-time')
const moment = require('moment-timezone')
const responseHelper = require('express-response-helper').helper();

moment.tz.setDefault('UTC');

// express setup
const app = express()
app.use(responseHelper);
app.use(express.json())
app.use(responseTime());

// Cors setup
var corsOptions = {
    origin: process.env.CLIENT_HOME_PAGE_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));



// app.use((req, res, next) => {
   
//     const origin = req.headers.origin;
//     console.log("ORIGIN: ",origin);
//     var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//     console.log(fullUrl);
//   if (allowedDomains.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//     next();
//   } else {
//     res.status(403).json({ error: 'Unauthorized domain' });
//   }
// });


app.get('/', (req, res)=>{
    res.send("Server Running...)");
})



app.use('/auth', require('./routes/auth.route'))
app.use('/users', require('./routes/user.route'))




const PORT = process.env.PORT || 8000;
app.listen( PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
