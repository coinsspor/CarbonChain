import axios from 'axios';
import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

class AirService {
  constructor() {
    this.apiUrl = process.env.AIR_API_URL || 'https://api.sandbox.air3.com';
    this.partnerId = process.env.AIR_PARTNER_ID;
    this.issuerDID = process.env.AIR_ISSUER_DID;
    this.schemaId = process.env.SCHEMA_ID;
    this.issuanceProgramId = process.env.ISSUANCE_PROGRAM_ID;
    this.verificationProgramId = process.env.VERIFICATION_PROGRAM_ID;
    
    try {
      this.privateKey = readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
    } catch (error) {
      console.error('❌ Failed to load private key:', error.message);
    }
  }

  generateJWT() {
    const payload = {
      iss: this.issuerDID,
      sub: this.partnerId,
      aud: 'air-kit',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    };

    return jwt.sign(payload, this.privateKey, {
      algorithm: 'RS256',
      keyid: 'carbonchain-key-1'
    });
  }

  async issueCredential(creditData) {
    try {
      const token = this.generateJWT();

      const credentialSubject = {
        id: creditData.recipientDID || `did:air:id:${Date.now()}`,
        creditId: creditData.creditId,
        registry: creditData.registry,
        projectId: creditData.projectId,
        projectName: creditData.projectName,
        vintage: creditData.vintage,
        quantity: creditData.quantity,
        projectType: creditData.projectType,
        qualityScore: creditData.qualityScore || 85,
        status: creditData.status || 'Active',
        price: creditData.price,
        methodology: creditData.methodology || 'VM0015',
        verificationBody: creditData.verificationBody || 'SustainCERT',
        verificationDate: creditData.verificationDate || new Date().toISOString().split('T')[0],
        country: creditData.country,
        additionality: creditData.additionality || 90,
        permanence: creditData.permanence || 85,
        mrvRobustness: creditData.mrvRobustness || 88,
        overallRating: creditData.overallRating || 'AA',
        registryVerified: true,
        thirdPartyAudited: true,
        transparencyScore: creditData.transparencyScore || 92,
        leakageControl: creditData.leakageControl || 87,
        doubleCountingCheck: true,
        sdgImpacts: creditData.sdgImpacts || 'SDG13,SDG15',
        blockchain: creditData.blockchain || 'Moca',
        isRetired: creditData.isRetired || false
      };

      const response = await axios.post(
        `${this.apiUrl}/v1/credentials/issue`,
        {
          schemaId: this.schemaId,
          programId: this.issuanceProgramId,
          credentialSubject
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Partner-ID': this.partnerId
          }
        }
      );

      return {
        success: true,
        credentialId: response.data.credentialId,
        credential: response.data.credential
      };

    } catch (error) {
      console.error('❌ AIR API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async verifyCredential(credentialId) {
    try {
      const token = this.generateJWT();

      const response = await axios.post(
        `${this.apiUrl}/v1/credentials/verify`,
        {
          credentialId,
          programId: this.verificationProgramId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Partner-ID': this.partnerId
          }
        }
      );

      return {
        success: true,
        verified: response.data.verified,
        credential: response.data.credential
      };

    } catch (error) {
      return {
        success: false,
        verified: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
}

const airService = new AirService();
export default airService;
