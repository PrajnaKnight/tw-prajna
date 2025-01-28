import React, { createContext, useContext, useState } from 'react';


export type VerificationResult = {
  success?: boolean;
  message?: string;
  error?: string;
};

// Define the shape of the context
interface KYCContextType {
    kycSteps: {
      text: string;
      icon: string;
      completed: boolean;
      error?: boolean;
      details?: string; 
      docType: string;
    }[];
    updateKYCStepStatus: (docType: string, isSuccess: boolean, details?: string) => void; // Update to use docType
    updateLocationConsentStatus: (isSuccess: boolean) => void;
    handleLocationConsent: (consent: boolean) => void;
    verifyPasscode: () => void; 
    randomNumber: number; 
    isLocationConsentVerified: boolean; 
    requestId: number;
    updateRandomNumber: (number: number) => void; 
    verificationResult: VerificationResult | null;
    setVerificationResultVerify: React.Dispatch<React.SetStateAction<VerificationResult | null>>;
  
  }

// Provide a default context value that matches the shape of KYCContextType
const defaultContextValue: KYCContextType = {
  kycSteps: [
    { docType: 'Secret', text: 'Please enter the provided Secret code', icon: 'LensIcon', completed: false }
  ],
  updateKYCStepStatus: () => {}, // Existing no-op function for illustration
  updateLocationConsentStatus: () => {}, // Existing no-op function for illustration
  handleLocationConsent: () => {}, // Existing no-op function for illustration
  verifyPasscode: () => {}, // Existing no-op function for illustration
  randomNumber: 0, // Add a default value for randomNumber
  requestId: 0,
  updateRandomNumber: () => {}, // Add a no-op function for updateRandomNumber
  isLocationConsentVerified: false,
  verificationResult: null,
  setVerificationResultVerify: () => {},
};


const KYCContext = createContext<KYCContextType>(defaultContextValue);

export const useKYCContext = () => useContext(KYCContext);

export const KYCProvider: React.FC = ({ children }) => {
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);
  const [isLocationConsentVerified, setIsLocationConsentVerified] = useState(false);
  const [requestId, setRequestId] = useState<number>(0);
  const [verificationResult, setVerificationResultVerify] = useState<VerificationResult | null>(null);

  const defaultKycSteps = [
    {docType:'Secret', text: 'Please enter the provided Secret code', icon: 'LensIcon', completed: false },
  ];

   // Function to update the random number
   const updateRandomNumber = (number: number) => {
    setRandomNumber(number);
  };

 
const allKycSteps  = [
  ...defaultKycSteps,
  {docType:'Location', text: 'Please provide location consent', icon: 'LensIcon', completed: false },
  {docType:'Web', text: 'Please share Web photo with agent.', icon: 'LensIcon', completed: false },
  {docType:'Number',text: 'Please note the visible number on the screen, then photograph it.', icon: 'LensIcon', completed: false },
  {docType:'PAN', text: 'Please share PAN photo with agent.', icon: 'LensIcon', completed: false },
  {docType:'Aadhaar Front', text: 'Please share Aadhaar Front photo with agent.', icon: 'LensIcon', completed: false },
  {docType:'Aadhaar Back', text: 'Please share Aadhaar Back photo with agent.', icon: 'LensIcon', completed: false },
  {docType:'Signature', text: 'Please share Signature photo with agent.', icon: 'LensIcon', completed: false },
];

const [kycSteps, setKycSteps] = useState<KYCContextType['kycSteps']>(defaultKycSteps);


const postLocationDetails = async (latitude : number, longitude : number) => {
  const url = 'https://demo-utopia-los-api-qa.knightfintech.com/swagger/ui/index';
  const bodyData = {
    RequestId: requestId, // Adjust as needed
    Latitude: latitude.toString(),
    Longitude: longitude.toString(),
  };

  try {
    const response = await fetch('https://demo-utopia-los-api-qa.knightfintech.com/SaveLocationDetails', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "https://vkyc-vd.knightfintech.com"},
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    console.log('Location Details Saved:', data, requestId);
  } catch (error) {
    console.error('Failed to post location details:', error);
  }
};


  const handleLocationConsent = (consent: boolean) => {
    localStorage.setItem('locationConsent', JSON.stringify(consent));
    if (consent) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          postLocationDetails(position.coords.latitude, position.coords.longitude);
          const locationDetails = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
          console.log(`Location obtained: ${locationDetails}`);
          // Now pass locationDetails as part of the update
          updateKYCStepStatus('Location', true, locationDetails)
          setIsLocationConsentVerified(true); 
        },
        (error) => {
          console.error(`Error obtaining location: ${error.message}`);
          updateKYCStepStatus('Location', false)
          setIsLocationConsentVerified(false);
        }
      );
    } else {
      console.log('Location consent not given');
      updateKYCStepStatus('Location', false)
      setIsLocationConsentVerified(false);
    }
  };
  
  
  const updateLocationConsentStatus = (isSuccess: boolean) => {
    // Similar logic to `updateKYCStepStatus`, but specifically for location consent
    const updatedSteps = kycSteps.map(step => {
      if (step.text === 'Please provide location consent') { // Make sure the text matches your step
        return { ...step, completed: isSuccess, icon: isSuccess ? 'CheckCircleIcon' : 'ErrorIcon' };
      }
      return step;
    });

    setKycSteps(updatedSteps);
  };
  
  const updateKYCStepStatus = (docType: string, isSuccess: boolean, details?: string) => {
    // Prevent update if the passcode hasn't been verified yet, except for the initial passcode step.
    if (!passcodeVerified && docType !== 'Secret') {
      console.error("Attempted to update KYC step status before passcode verification.");
      return;
    }
  
    setKycSteps(currentSteps => {
      const updatedSteps = currentSteps.map(step => {
        if (step.docType === docType) {
          return { ...step, completed: isSuccess, icon: isSuccess ? 'CheckCircleIcon' : 'ErrorIcon', details: details || step.details };
        }
        return step;
      });
      return updatedSteps;
    });
  };
  
   // Function to generate a unique requestId
   const generateRequestId = () => Math.floor(Math.random() * 1000000); // Simple random number generator

   const verifyPasscode = () => {
     setRequestId(generateRequestId()); // Generate and set a new requestId
     setKycSteps(allKycSteps); // Now that the passcode is verified, we show all the steps.
     setPasscodeVerified(true);
   };
 

  const providerValue = {
    kycSteps,
    updateKYCStepStatus,
    updateLocationConsentStatus,
    handleLocationConsent, 
    verifyPasscode,
    randomNumber,
    updateRandomNumber,
    isLocationConsentVerified,
    requestId,
    verificationResult,
    setVerificationResultVerify,
  };



  return (
    <KYCContext.Provider value={providerValue}>
      {children}
    </KYCContext.Provider>
  );
};
