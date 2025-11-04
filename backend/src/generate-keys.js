import { generateKeyPair } from 'crypto';
import { writeFileSync, mkdirSync } from 'fs';
import { promisify } from 'util';

const generateKeyPairAsync = promisify(generateKeyPair);

async function generateKeys() {
  console.log('🔐 Generating RSA key pair...');
  
  try {
    const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    mkdirSync('./keys', { recursive: true });
    writeFileSync('./keys/private.key', privateKey);
    writeFileSync('./keys/public.key', publicKey);
    
    const jwks = {
      keys: [{
        kty: "RSA",
        use: "sig",
        alg: "RS256",
        kid: "carbonchain-key-1"
      }]
    };

    writeFileSync('./keys/jwks.json', JSON.stringify(jwks, null, 2));
    console.log('✅ Keys generated successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

generateKeys();
