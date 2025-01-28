import React, { useState, useEffect } from 'react';
import { makeStyles, Theme, Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import LensIcon from '@material-ui/icons/Lens';
import VideoLogo from './VideoLogo';
import TwilioLogo from './TwilioLogo';
import GreenCheckIcon from './GreenCheckIcon';  
import RedErrorIcon from './RedErrorIcon';
import { useAppState } from '../../state';
import UserMenu from './UserMenu/UserMenu';
import { useLocation } from 'react-router-dom';
import ConsentModal from '../../components/LocationAccess/ConsentModal';
import { useKYCContext } from '../../components/Context/KycContext';


const useStyles = makeStyles((theme: Theme) => ({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  container: {
    position: 'relative',
    flex: '1',
  },
  innerContainer: {
    display: 'flex',
    width: '90%',
    height: '85vh',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px 0px rgba(40, 42, 43, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    margin: '50px auto 0',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      height: 'auto',
      width: 'calc(100% - 40px)',
      margin: 'auto',
      maxWidth: '400px',
      marginTop:'50px',
    },
  },
  logoContainer: {
    position: 'absolute',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      width: '90%',
      textAlign: 'initial',
      '& svg': {
        height: '64px',
      },
    },
  },
  knightLogo: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '5px 0',
    width: '150px',
  },
  content: {
    background: 'white',
    width: '100%',
    padding: '4em',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: '2em',
    },
  },
  listItem: {
    paddingLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(1),
    },
   
  },
  listItemIcon: {
    minWidth: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      minWidth: "40px"
    },
  },
  listItemText: {
    '& .MuiTypography-body1': {
      fontWeight: 'bold',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize:'14px',
    },
  },
  swooshContainer: {
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    alignItems: 'center',
    justifyContent: 'flex-start', // Start from the top
    backgroundColor: '#ff8500',
    width: '40%',
    padding: theme.spacing(4), // Add some padding inside the swooshContainer
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100%',
      padding: theme.spacing(2),
    },
  },
  title: {
    color: 'white',
    alignSelf: 'flex-start', // Align title to the start of the flex container
    width: '100%',
    marginBottom: theme.spacing(2), // Add margin below the title
    textAlign: 'center',
    fontWeight:'bold',
    fontSize:'20px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.1rem',
      textAlign: 'center',
      alignSelf: 'center', // Center title on small screens
    },
  },
  logo: {
    height: '45px', // Set the VideoLogo size
    marginBottom: theme.spacing(2), // Add margin below the logo
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing(2), 
    borderRadius:'5px',
    [theme.breakpoints.down('sm')]: {
      marginTop:'10px',
    },
  },
}));

interface IntroContainerProps {
  children: React.ReactNode;
  isUserInRoom?: boolean;
}
interface KYCStep {
  text: string;
  icon: React.ReactElement; // Using React.ReactElement for JSX elements
  completed: boolean;
  error?: boolean; // Optional property to indicate an error state
}

IntroContainer.defaultProps = {
  isUserInRoom: false, 
};
export default function IntroContainer({ children, isUserInRoom = false }: IntroContainerProps) {
  const classes = useStyles();
  const { user } = useAppState();
  const location = useLocation();
  const { kycSteps, handleLocationConsent, verificationResult  } = useKYCContext();
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    setConsentGiven(null);
  }, []);


  return (
    <div>
    <TwilioLogo className={classes.knightLogo} />
    <div className={classes.background}>
     
      {/* Logo, UserMenu, and other static components */}
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.swooshContainer}>
            <Typography variant="h6" className={classes.title}>Knight Fintech Video KYC</Typography>
            {verificationResult ? (
                            verificationResult.success ? <GreenCheckIcon />
                            : <RedErrorIcon />
                        ) : (
                            <VideoLogo />
                        )}
            {consentGiven === null && isUserInRoom && (
              <ConsentModal onConsent={(consent) => {
                  setConsentGiven(consent);
                  handleLocationConsent(consent);
              }} />
            )}
              {verificationResult ? (
         <div style={{background:'#ffffff',borderRadius:'10px', padding:"50px", marginTop:"15px"}}>
         <Typography variant="h6" className={classes.title} style={{ color: verificationResult.success ? 'green' : 'red' }}>
             {verificationResult.message || verificationResult.error}
         </Typography>
     </div>
        ) : (
          <List className={classes.list}>
            {kycSteps.map((step, index) => (
              <ListItem key={index} disabled={!step.completed && step.error}>
                <ListItemIcon>
                  {step.completed ? <CheckCircleIcon style={{ color: 'green' }} />
                  : step.error ? <ErrorIcon color="error" />
                  : <LensIcon style={{ color: 'grey' }} />}
                </ListItemIcon>
                <ListItemText primary={step.text} secondary={step.details && `Details: ${step.details}`} />
              </ListItem>
            ))}
         </List>
        )}
           
          </div>
          <div className={classes.content}>{children}</div>
        </div>
      </div>
    </div>
    </div>
  );
}
