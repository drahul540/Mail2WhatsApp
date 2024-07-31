require('dotenv').config();

module.exports = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    PROJECT_ID: process.env.PROJECT_ID,
    TOPIC_NAME: process.env.TOPIC_NAME,
    PORT: process.env.PORT
};
