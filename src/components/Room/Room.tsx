import React from 'react';
import clsx from 'clsx';
import { makeStyles, Theme } from '@material-ui/core';
import ChatWindow from '../ChatWindow/ChatWindow';
import ParticipantList from '../ParticipantList/ParticipantList';
import MainParticipant from '../MainParticipant/MainParticipant';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import { Height } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) => {
  const totalMobileSidebarHeight = `${theme.sidebarMobileHeight +
    theme.sidebarMobilePadding * 2 +
    theme.participantBorderWidth}px`;
  return {
    container: {
      position: 'relative',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
      gridTemplateRows: '100%',
      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: `100%`,
       // gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
        height:'50vh',
        marginBottom:'10px',
      },
    },
    chatWindowOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.chatWindowWidth}px` },
  };
});

export default function Room() {
  const classes = useStyles();
  const { isChatWindowOpen } = useChatContext();
  return (
    <div className={clsx(classes.container, { [classes.chatWindowOpen]: isChatWindowOpen })}>
      <MainParticipant />
      <ParticipantList />
      <ChatWindow />
    </div>
  );
}
