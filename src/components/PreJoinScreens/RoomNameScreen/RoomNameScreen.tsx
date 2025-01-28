import React, { useState,ChangeEvent, FormEvent } from 'react';
import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme } from '@material-ui/core';
import { useAppState } from '../../../state';
import { useKYCContext } from '../../../components/Context/KycContext'; 

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 3.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  textFieldContainer: {
    width: '100%',
   
  },
  label:{
    [theme.breakpoints.down('sm')]: {
      fontSize:'14px',
    },
  },
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));


interface RoomNameScreenProps {
  name: string;
  roomName: string;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>, isCodeValid: boolean) => void; 
  onValidPasscode: () => void;
  onInvalidPasscode: () => void;
  updateKYCStepStatus: (docType: string, isSuccess: boolean, details?: string) => void;

}

export default function RoomNameScreen({ name, roomName, setName, setRoomName, handleSubmit, onValidPasscode, onInvalidPasscode, updateKYCStepStatus }: RoomNameScreenProps) {
  const classes = useStyles();
  const { user } = useAppState();
  //const { updateKYCStepStatus } = useKYCContext();
  const { verifyPasscode } = useKYCContext();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
    setError('')
  };

  const passcode = "123123";

  const [error, setError] = useState("");

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;


  const localHandleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isCodeValid = roomName === passcode;
    if (isCodeValid) {
      onValidPasscode();
      verifyPasscode();
      updateKYCStepStatus('Secret', true); // Mark as completed
    } else {
      setError("Invalid passcode entered. Please try again.");
      onInvalidPasscode();
      updateKYCStepStatus('Secret', false, "Invalid passcode entered."); // Mark as error with details
    }
  };
  
  

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Enter VKYC Room
      </Typography>
      <Typography variant="body1">
        {hasUsername
          ? "Enter the secret code shared on your mobile/email."
          : "Enter the secret code shared on your mobile/email."}
      </Typography>
      <form onSubmit={localHandleSubmit}>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <div className={classes.textFieldContainer}>
              <InputLabel className={classes.label} shrink htmlFor="input-user-name">
                Your Name
              </InputLabel>
              <TextField
                id="input-user-name"
                variant="outlined"
                fullWidth
                size="small"
                value={name}
                onChange={handleNameChange}
              />
            </div>
          )}
          <div className={classes.textFieldContainer}>
            <InputLabel className={classes.label} shrink htmlFor="input-room-name">
             Enter Secret Code
            </InputLabel>
            <TextField
              autoCapitalize="false"
              id="input-room-name"
              variant="outlined"
              fullWidth
              size="small"
              value={roomName}
              type='password'
              onChange={handleRoomNameChange}
              error={!!error}
              helperText={error}
            />
          </div>
        </div>
        <Grid container justify="flex-end">
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={!!error || !roomName}
          className={classes.continueButton}
        >
          Continue
</Button>
        </Grid>
     
      </form>
    </>
  );
}
