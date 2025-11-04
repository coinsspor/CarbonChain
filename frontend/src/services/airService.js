import { AirService, BUILD_ENV } from '@mocanetwork/airkit';

let airServiceInstance = null;

export const getAirService = () => {
  if (!airServiceInstance) {
    airServiceInstance = new AirService({
      partnerId: import.meta.env.VITE_AIR_PARTNER_ID,
      buildEnv: BUILD_ENV.SANDBOX,
      backendUrl: import.meta.env.VITE_BACKEND_URL
    });
  }
  return airServiceInstance;
};

export const issueCredential = async (credentialData) => {
  const airService = getAirService();
  
  const credential = {
    schemaId: import.meta.env.VITE_SCHEMA_ID,
    programId: import.meta.env.VITE_ISSUANCE_PROGRAM_ID,
    credentialSubject: {
      ...credentialData,
      issuedAt: new Date().toISOString()
    }
  };

  return await airService.issueCredential(credential);
};

export const verifyCredential = async () => {
  const airService = getAirService();
  
  return await airService.verifyCredential({
    programId: import.meta.env.VITE_VERIFICATION_PROGRAM_ID
  });
};
