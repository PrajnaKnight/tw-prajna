// import React from 'react';
// import ReactDOM from 'react-dom';

// import { CssBaseline } from '@material-ui/core';
// import { MuiThemeProvider } from '@material-ui/core/styles';

// import App from './App';
// import AppStateProvider, { useAppState } from './state';
// import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
// import ErrorDialog from './components/ErrorDialog/ErrorDialog';
// import LoginPage from './components/LoginPage/LoginPage';
// import WelcomePage from './components/Welcome/WelcomePage';
// import PrivateRoute from './components/PrivateRoute/PrivateRoute';
// import theme from './theme';
// import './types';
// import { ChatProvider } from './components/ChatProvider';
// import { VideoProvider } from './components/VideoProvider';
// import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
// import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

// const VideoApp = () => {
//   const { error, setError } = useAppState();
//   const connectionOptions = useConnectionOptions();

//   return (
//     <VideoProvider options={connectionOptions} onError={setError}>
//       <ErrorDialog dismissError={() => setError(null)} error={error} />
//       <ChatProvider>
//         <App />
//       </ChatProvider>
//     </VideoProvider>
//   );
// };

// ReactDOM.render(
//   <MuiThemeProvider theme={theme}>
//     <CssBaseline />
//     <UnsupportedBrowserWarning>
//       <Router>
//         <AppStateProvider>
//           <Switch>
//             <Route path="/login">
//               <LoginPage />
//             </Route>
//             <PrivateRoute exact path="/" >
//               <VideoApp />
//             </PrivateRoute>
//             <PrivateRoute path="/room/:URLRoomName">
//               <VideoApp />
//             </PrivateRoute>
//             <Route path="/welcome">
//               <WelcomePage />
//             </Route>
          
//           </Switch>
//         </AppStateProvider>
//       </Router>
//     </UnsupportedBrowserWarning>
//   </MuiThemeProvider>,
//   document.getElementById('root')
// );

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Context/AuthContext';
import { KYCProvider } from './components/Context/KycContext';
import UserView from './pages/UserView/UserView';
import AgentView from './pages/AgentView/AgentView';
import LoginPage from './pages/LoginPage/LoginPage';

const RoleBasedRoute: React.FC = () => {
  const { role } = useAuth();

  if (!role) return <Navigate to="/login" />;
  return <Navigate to={role === 'agent' ? '/agent' : '/user'} />;
};

ReactDOM.render(
  <AuthProvider>
    <KYCProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<UserView />} />
          <Route path="/agent" element={<AgentView />} />
          <Route path="/" element={<RoleBasedRoute />} />
        </Routes>
      </Router>
    </KYCProvider>
  </AuthProvider>,
  document.getElementById('root')
);

