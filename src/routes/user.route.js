const router = require('express').Router();
const { verifyWallet } = require('../middlewares/auth.middleware')

router.get('/', verifyWallet, async (req, res) => {
    try{
        console.log(req)
        res.respond('Api called')
    }catch(error){
        res.failServerError(error?.message)
    }
})

module.exports = router