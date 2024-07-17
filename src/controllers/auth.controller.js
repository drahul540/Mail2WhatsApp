const nacl = require('tweetnacl');
const bs58 = require('bs58');
const jwt = require('jsonwebtoken');
const { PublicKey } = require('@solana/web3.js');
const AuthModel = require("../db/models/usersModel");

const SECRET_KEY = '50EKQW55La7Ia53RuFPYbSabKvtAPVnj';

class Auth {
    constructor(){}
    
    // Authenticate User
    async register(body){
        const { publicKey, signedMessage } = body;

        try {
            const message = new TextEncoder().encode('Authenticate with Solana Wallet');
            const pubKey = new PublicKey(publicKey);
            const isValidSignature = nacl.sign.detached.verify(
              message,
              new Uint8Array(signedMessage),
              pubKey.toBuffer()
            );

            if (isValidSignature) {
                
                // Create user if does not exist
                const user = await AuthModel.findOne({ wallet: publicKey });
                
                if(user) {
                    const token = jwt.sign({_id: user._id, wallet: user.wallet}, SECRET_KEY, { expiresIn: '24h' });
                    return {user, token}
                };
                
                const newUser = await AuthModel.create({
                    username: publicKey,
                    wallet: publicKey,
                    role: 'DEFAULT'
                })
                const token = jwt.sign({_id: newUser._id, wallet: newUser.wallet}, SECRET_KEY, { expiresIn: '24h' });
                return {newUser, token}
              
            } else {
                throw new Error('Authentication failed');
                // res.status(401).json({
                //     authenticated: false,
                //     message: "Authentication failed"
                // });
            }
        } catch (error) {
            console.error('Error verifying signature:', error);
            throw new Error('Error verifying signature:', error?.message);
            
        }
    }
}

module.exports = new Auth();