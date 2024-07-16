const router = require('express').Router();
const AuthController = require('../controllers/auth.controller')

router.post('/', async (req, res) => {
    try{
        const resData = AuthController.register(req.body)
        res.respond(resData)
    }catch(error){
        res.failServerError(error?.message)
    }
})

module.exports = router;