import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useKYCContext } from '../../components/Context/KycContext';

export enum Steps {
  roomNameStep = 'roomNameStep',
  deviceSelectionStep = 'deviceSelectionStep',
}

export enum KYCStepStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Error = 'Error',
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const { URLRoomName } = useParams<{ URLRoomName?: string }>();
  const { updateKYCStepStatus } = useKYCContext(); // Correctly retrieve from context

  const [step, setStep] = useState('roomNameStep');
  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');
  const [mediaError, setMediaError] = useState<Error | undefined>();

  const onValidPasscode = () => {
    console.log("Valid Passcode");
    console.log("update kyc Status",updateKYCStepStatus); 
    // Update to use a string that matches one of the kycSteps' text values
    updateKYCStepStatus('Secret', true);
    setStep('deviceSelectionStep'); // Also updated to string for consistency
  };

  const onInvalidPasscode = () => {
    console.log("Invalid Passcode");
    // Make sure to use the correct string that matches your kycSteps configuration
    updateKYCStepStatus('Secret', false, "Invalid passcode entered.");
  };

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
      if (user?.displayName) {
        setStep('deviceSelectionStep');
      }
    }
  }, [user, URLRoomName]);

  useEffect(() => {
    if (step === 'deviceSelectionStep' && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>, isCodeValid: boolean) => {
    event.preventDefault();
    if (isCodeValid) {
      setStep('deviceSelectionStep');
    } else {
      console.error('Invalid code entered');
    }
  };

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      {step === Steps.roomNameStep && (
        <RoomNameScreen
        name={name}
        roomName={roomName}
        setName={setName}
        setRoomName={setRoomName}
        handleSubmit={handleSubmit}
        onValidPasscode={onValidPasscode}
        onInvalidPasscode={onInvalidPasscode}
        updateKYCStepStatus={updateKYCStepStatus}
      />
      )}
      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />
      )}
    </IntroContainer>
  );
}
