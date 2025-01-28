import React, { useState } from 'react';
import { makeStyles, Button, Card, CardContent, Typography, Collapse, IconButton } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

interface File {
    id: number;
    name: string;
    status: 'Completed' | 'Pending';
    imageUrl: string;
    data: string;
  }

const useStyles = makeStyles(theme => ({
  filelistcontainer: {
    backgroundColor: "#f3f3f3", 
    padding: "20px",
    borderRadius: "5px",
    width:'100%',
  },
  filelist: {
    display: 'flex',
    flexDirection: 'column',
  },
  fileentry: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  filestatus: {
    width: '100px',
    textAlign: 'center',
    borderRadius: '5px',
    padding: '5px',
    marginRight: '10px',
  },
  completed: {
    backgroundColor: 'green',
    color: 'white',
  },
  pending: {
    backgroundColor: 'red',
    color: 'white',
  },
  filedetails: {
    display: 'flex',
    alignItems: 'center',
  },
  fileimage: {
    width: '50px',
    height: '50px',
    marginRight: '10px',
  },
  filemetadata: {
    display: 'flex',
    flexDirection: 'column',
  },
  filename: {
    fontWeight: 'bold',
  },
  filedata: {
    fontSize: '0.85em',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  acceptButton: {
    marginRight: '8px', 
  },
  ImgWrapper:{
    width:'150px',
    height:'150px',
    border:'1px solid #000',
    margin:'0 10px',
  },
  detailCardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  card: {
    marginBottom: theme.spacing(1),
    transition: theme.transitions.create('margin', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  detailCard: {
    width: '100%',
  },
  fileImage: {
    width: '100%', // make image take the full width of card content area
    marginTop: theme.spacing(2),
  },
  fileInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > *': {
      marginTop: theme.spacing(1),
    },
  },
}));

// Dummy data for file uploads
const dummyFiles: File[] = [
    { id: 1, name: 'Aadhaar Front', status: 'Completed', imageUrl: './dummyaadhaar.jpeg', data: 'Aadhaar Number: 1234 5678 9101' },
    { id: 2, name: 'PAN', status: 'Pending', imageUrl: './dummypan.jpg', data: 'PAN Number: ABCDE1234F' },
    // ...add more files as needed
  ];
  

const FileListComponent = () => {
    const classes = useStyles();
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null); // State to keep track of selected file
  const [files, setFiles] = useState<File[]>(dummyFiles); // Initialize state with dummy data

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleExpandClick = (id: number) => {
    setExpandedId(expandedId !== id ? id : null);
  };

  const handleStatusChange = (id: number, newStatus: 'Completed' | 'Pending') => {
    setFiles(files.map(file => (file.id === id ? { ...file, status: newStatus } : file)));
    setSelectedFileId(null); // Optionally deselect the file after changing its status
  };

  


  return (
    <div className={classes.filelistcontainer}>
      <h2>Verification Documents</h2>
      {dummyFiles.map(file => (
        <Card key={file.id} className={classes.card}>
          <Typography variant="subtitle1">{file.name}</Typography>
          <div className={classes.ImgWrapper}>
            <img src={file.imageUrl} alt={file.name} className={classes.fileimage} />
          </div>
          {file.status === 'Completed' ? (
            <CheckCircleIcon style={{ color: 'green' }} />
          ) : (
            <CancelIcon color="error" />
          )}
          <IconButton
            className={`${classes.expand} ${expandedId === file.id ? classes.expandOpen : ''}`}
            onClick={() => handleExpandClick(file.id)}
            aria-expanded={expandedId === file.id}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <Collapse in={expandedId === file.id} timeout="auto" unmountOnExit>
            <Card className={classes.detailCard}>
              <CardContent className={classes.detailCardContent}>
                <Typography color="textSecondary">{file.data}</Typography>
                <Button variant="contained" color="primary" onClick={() => handleStatusChange(file.id, 'Completed')}>
                  Accept
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleStatusChange(file.id, 'Pending')}>
                  Reject
                </Button>
              </CardContent>
            </Card>
          </Collapse>
        </Card>
      ))}
    </div>
  );
};
export default FileListComponent;