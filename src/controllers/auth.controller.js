const nacl = require('tweetnacl');
const bs58 = require('bs58');
const { PublicKey } = require('@solana/web3.js');

class Auth {
    constructor(){}

    async register(body){
        const { message, signature, publicKey } = body;

        try {
            const encodedMessage = new TextEncoder().encode(message);
            const decodedSignature = bs58.decode(signature);
            const decodedPublicKey = new PublicKey(publicKey).toBytes();

            const isValid = nacl.sign.detached.verify(
                encodedMessage,
                decodedSignature,
                decodedPublicKey
            );

            if (isValid) {
                // Create user if does not exist
                AuthModel.findOne({
                    wallet: decodedPublicKey,
                }).then( (user)=>{
                    
                    if (!user) {
                        AuthModel.create({
                            username: profile.username,
                            wallet: profile.displayName,
                            role: 'DEFAULT'
                        }).then((createdUser) => {
                            return createdUser
                        })
                    }else{
                        return user
                    }

                })
            } else {
                res.status(401).json({
                    authenticated: false,
                    message: "Authentication failed"
                });
            }
        } catch (error) {
            console.error('Error verifying signature:', error);
            res.failServerError(error?.message)
        }
    }
}

module.exports = new Auth();