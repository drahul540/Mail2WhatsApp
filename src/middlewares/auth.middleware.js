
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const { PublicKey } = require('@solana/web3.js');
const AuthModel = require("../db/models/usersModel");

// Middleware to verify wallet address for each API call
const verifyWallet = (req, res, next) => {
  const walletAddress = req.headers['x-wallet-address'];
  const nonce = req.headers['x-nonce'];
  const signature = req.headers['x-signature'];

  if (!walletAddress || !nonce || !signature) {
    return res.status(400).send({ message: 'Missing authentication headers' });
    
  }

  try {
    const message = `Sign this message to authenticate with our service. Nonce: ${nonce}`;
    const encodedMessage = new TextEncoder().encode(message);
    const decodedSignature = bs58.decode(signature);
    const decodedPublicKey = new PublicKey(walletAddress).toBytes();

    const isValid = nacl.sign.detached.verify(
      encodedMessage,
      decodedSignature,
      decodedPublicKey
    );

    if (isValid) {
      next()
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
};

module.exports = { verifyWallet }

