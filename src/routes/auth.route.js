const router = require('express').Router();
const AuthController = require('../controllers/auth.controller')

router.post('/', async (req, res) => {
    try{
        const resData = await AuthController.register(req.body);
        console.log(resData)
        res.respond(resData)
    }catch(error){
        res.failServerError(error?.message)
    }
})

module.exports = router;