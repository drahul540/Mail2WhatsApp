
const EmailsSchema = require('../db/models/emailsModel')
const EmailUtils = require('../utils/gmail/email')

class GmailController{
    constructor(){}

    latestMessage(){
        EmailUtils.getLatestMessage((resData)=>{
            EmailsSchema.create({
                messageId: resData.messageId,
                metadata: resData.metadata,
                from: resData.metadata?.from?.value[0].address,
                subject: resData.metadata?.subject
            }).then((inserted)=>{
                console.log('Inserted Message...')
                console.log('Message Id: ', resData.messageId, '| Subject: ', resData.metadata?.subject)
            }).catch((error)=>{
                console.log('Error Message Id: ', resData.messageId, '| Subject: ', resData.metadata?.subject)
                console.log('Error: ', error?.message)
            })
            
        })
    }
}

module.exports = new GmailController();