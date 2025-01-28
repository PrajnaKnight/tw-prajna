  import React, { useRef, useEffect, useState } from 'react';
  import { IVideoTrack } from '../../types';
  import { styled } from '@material-ui/core/styles';
  import { Track } from 'twilio-video';
  import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';
  import useVideoTrackDimensions from '../../hooks/useVideoTrackDimensions/useVideoTrackDimensions';
  import { useKYCContext } from '../../components/Context/KycContext';
  import { disconnect } from 'process';


  const Video = styled('video')({
    width: '100%',
    height: '100%',
  });

  const Canvas = styled('canvas')({
    display: 'none',
  });

  interface VideoTrackProps {
    track: IVideoTrack;
    isLocal?: boolean;
    priority?: Track.Priority | null;
  }
  interface Payload {
    docId: number;
    image: string;
    requestId: number;
    agentUserId: number;
    number?: number; // Make 'number' an optional property
  }

  type VerificationResult = {
    success?: boolean; 
    message?: string; 
    error?: string;  
  }
  

  // Define document types
  type DocumentType = 'Web' | 'Number' | 'PAN' | 'Aadhaar Front' | 'Aadhaar Back' | 'Signature';

  const documentTypes: DocumentType[] = ['Web', 'Number', 'PAN', 'Aadhaar Front', 'Aadhaar Back', 'Signature'];

  export default function VideoTrack({ track, isLocal, priority }: VideoTrackProps) {
    const { randomNumber, updateRandomNumber, updateKYCStepStatus, isLocationConsentVerified, requestId, setVerificationResultVerify  } = useKYCContext();
    const ref = useRef<HTMLVideoElement>(null!);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mediaStreamTrack = useMediaStreamTrack(track);
    const dimensions = useVideoTrackDimensions(track);
    const isPortrait = (dimensions?.height ?? 0) > (dimensions?.width ?? 0);
    const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false); 
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [isVerifying, setIsveriifying] = useState(false);

    // Function to generate a new random number
      const generateRandomNumber = () => Math.floor(Math.random() * 10000); // Example: generates a number between 0-9999

      
    // Optional: State to hold the current document type
    const [currentDocType, setCurrentDocType] = useState<DocumentType>('Web'); 
    const [allDocumentsCaptured, setAllDocumentsCaptured] = useState(false);

    // Update the document type to the next in sequence on each capture
    const updateDocType = () => {
      const currentIndex = documentTypes.indexOf(currentDocType);
      const nextIndex = (currentIndex + 1) % documentTypes.length;
      setCurrentDocType(documentTypes[nextIndex]);
    
      // Check if we've looped back to the start
      if (nextIndex === 0) {
        setAllDocumentsCaptured(true); // All documents have been captured
      }  
    };
    const [attemptCount, setAttemptCount] = useState(0);

  //The document type maps directly to a required 'docId'
  const docTypeToIdMap = {
    'Web' : 1004,
    'Number': 1006,
    'PAN' : 1001,
    'Aadhaar Front' : 1002,
    'Aadhaar Back' : 1003, 
    'Signature' : 1005
  };

  const captureImage = async (docType: DocumentType) => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const video = ref.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        let payload: Payload = {
          docId: docTypeToIdMap[docType],
          image: imageDataUrl.split(',')[1],
          requestId: requestId,
          agentUserId: 0,
          ...(docType === 'Number' && { number: randomNumber })
        };
  
        try {
          const response = await fetch('https://demo-utopia-los-api-qa.knightfintech.com/UploadVKYCDocumentData', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin": "https://vkyc-vd.knightfintech.com"
            },
            body: JSON.stringify(payload),
          });
  
          const responseData = await response.json();
          console.log(responseData);
          if (responseData.IsVerified) {
            console.log("Verified",requestId)
            updateKYCStepStatus(docType, true);
            setVerificationResult({ success: true, message: 'Document uploaded successfully' });
            setAttemptCount(0);
            setIsProcessing(false);
            updateDocType();  // Only call this when verification is successful or max attempts reached
          } else {
            if (attemptCount < 4) {
              console.log("less than 4",requestId)
              alert(`Verification failed, please click on 'Capture ${docType}' again, remaining attempts: ${4 - attemptCount}`);

              updateKYCStepStatus(docType, false);
              setAttemptCount(attemptCount + 1);
            } else {
              console.log("Else",requestId)
              alert(`${docType} verification failed after 5 attempts.`)
              updateKYCStepStatus(`${docType} verification failed after 5 attempts.`, false);
              setAttemptCount(0);
              setShowRightPanel(false); 
             setVerificationResultVerify({ error: "Verification failed, our agent will connect with you for manual KYC." });
            
            }
            setIsProcessing(false);
          }
        } catch (error) {
          console.error('Verification failed:', error);
          if (attemptCount < 4) {
            console.log("catch if")
            updateKYCStepStatus(`${docType} verification error. Please try again.`, false);
            setAttemptCount(attemptCount + 1);
          } else {
            console.log("catch else")
            updateKYCStepStatus(`${docType} verification error after 5 attempts.`, false);
            setAttemptCount(0);
            setShowRightPanel(false);
          }
          setIsProcessing(false);
        }
      }
    }
  };

  
  

    // Simplified for demonstration
    const handleCaptureClick = () => {
     // updateDocType(); 
      captureImage(currentDocType);
    };


     // Use currentDocType after it's declared and initialized
     useEffect(() => {
      if (currentDocType === 'Number') {
        const newRandomNumber = generateRandomNumber();
        updateRandomNumber(newRandomNumber);
      }
    }, [currentDocType]);


  
    const handleVerify = async (requestId: number) => {
      setIsveriifying(true);
      try {
          const response = await fetch('https://demo-utopia-los-api-qa.knightfintech.com/VerifyOCRRequest', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  "Access-Control-Allow-Origin": "https://vkyc-vd.knightfintech.com"
              },
              body: JSON.stringify({ requestId }),
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log("Verification Response:", data);
          setIsveriifying(false);
  
          const failureReasons = [];
  
          // Extract the failure reasons
          if (data.PANResponse && !data.PANResponse.IsVerified) {
              failureReasons.push(`PAN failed with confidence ${data.PANResponse.Confidence}: ${data.PANResponse.Message || "PAN verification failed"}`);
          }
  
          if (data.AadhaarUidaiResponse && !data.AadhaarUidaiResponse.IsVerified) {
              failureReasons.push(`Aadhaar UIDAI failed with confidence ${data.AadhaarUidaiResponse.Confidence}: ${data.AadhaarUidaiResponse.Message || "Aadhaar UIDAI verification failed"}`);
          }
  
          if (data.AadhaarPANResponse && !data.AadhaarPANResponse.IsVerified) {
              failureReasons.push(`Aadhaar-PAN failed with confidence ${data.AadhaarPANResponse.Confidence}: ${data.AadhaarPANResponse.Message || "Aadhaar-PAN cross verification failed"}`);
          }
  
          if (failureReasons.length > 0) {
              const failureMessages = failureReasons.join("\n");
              setVerificationResultVerify({
                  success: false,
                  message: `KYC failed for ${failureReasons.length} documents.\n${failureMessages}`,
                  error: failureMessages
              });
          } else {
              setVerificationResultVerify({ success: true, message: "KYC successfully verified." });
          }
      } catch (error) {
          console.error("Verification failed:", error);
          setVerificationResultVerify({ error: "Verification failed. Please try again." });
          setIsveriifying(false);
      }
  };
  

    


    useEffect(() => {
      const el = ref.current;
      el.muted = false;
      if (track.setPriority && priority) {
        track.setPriority(priority);
      }
      track.attach(el);
      return () => {
        track.detach(el);
        if (track.setPriority && priority) {
          track.setPriority(null);
        }
      };
    }, [track, priority, captureImage]);

    // The local video track is mirrored if it is not facing the environment.
    const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment';
    const style = {
      transform: isLocal && isFrontFacing ? 'rotateY(180deg)' : '',
      objectFit: isPortrait || track.name.includes('screen') ? ('contain' as const) : ('cover' as const),
    };

  
   
    return (
      <>
  
     <Video ref={ref} style={style} />
        <Canvas ref={canvasRef} />

        {showRightPanel && (
      <>
        {currentDocType === 'Number' && isLocationConsentVerified && !allDocumentsCaptured && (
          <div style={{ background: 'black', position: 'absolute', color: 'white', padding: '10px', right: '0', left: '0', margin: '0 auto', textAlign: 'center', top: '45px' }}>
            Random Number: {randomNumber}
          </div>
        )}
        <div style={{ position: 'absolute', bottom: '-30px' }}>
          {!allDocumentsCaptured ? (
            <button disabled={isProcessing} onClick={handleCaptureClick} style={{ display: 'flex', flexDirection: 'row', borderRadius: '10px', background: '#ff8500', color: '#0194c', padding: '5px 10px', border: 'none', cursor: 'pointer', fontSize: "16px", }}>
              {isProcessing ? 'Processing...' : `Capture ${currentDocType}`}
            </button>
          ) : (
            <button disabled={isVerifying} onClick={() => handleVerify(requestId)} style={{ padding: '5px 10px', background: '#00194c', color: '#ffffff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
                {isVerifying ? 'Please wait...' : `Verify All Documents`} 
            </button>
          )}
        </div>
      </>
    )}

      </>
    );
  }

