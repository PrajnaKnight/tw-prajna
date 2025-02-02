import React from 'react';
import { styled, Theme } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import IntroContainer from './components/IntroContainer/IntroContainer';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import RecordingNotifications from './components/RecordingNotifications/RecordingNotifications';
import Room from './components/Room/Room';
import { KYCProvider } from './components/Context/KycContext';
import WelcomePage from './components/Welcome/WelcomePage';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
  margin:'10px'
});

const Main = styled('main')(({ theme }: { theme: Theme }) => ({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  background: 'white',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
    overflow: 'auto',
  },
}));

export default function App() {
  const roomState = useRoomState();
  const isUserInRoom = roomState === 'connected';
  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  return (
    <KYCProvider>
    <Container style={{ height }}>
      {roomState === 'disconnected' ? (
        <PreJoinScreens />
      ) : (
        <Main>
           <IntroContainer isUserInRoom={isUserInRoom}>
          <ReconnectingNotification />
          <RecordingNotifications />
          <MobileTopMenuBar />
          <Room />
          <MenuBar />
          </IntroContainer>
        
        </Main>
      )}
    </Container>
      </KYCProvider>
  );
}
