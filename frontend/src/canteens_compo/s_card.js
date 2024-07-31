// S_Card.js
import React, { useState } from 'react';
import { Button, Typography, createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material';
import { green } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import canteen_img from "./canteen_img.jpg"; 
import FeedbackModal from './FeedbackPopup'; // Import the FeedbackModal component

const theme = createTheme({
    palette: {
        primary: { main: "#e57417" },
        secondary: green
    }
});

function Card(props) {
    const [feedbackOpen, setFeedbackOpen] = useState(false);

    const handleFeedbackOpen = () => {
        setFeedbackOpen(true);
    };

    const handleFeedbackClose = () => {
        setFeedbackOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <div id={props.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px', borderRadius: '30px', backgroundColor: '#E9DCDC', margin: '20px' }}>
                <Typography variant='h6' id={props.id}>{props.name}</Typography>
                <img id={props.id} src={canteen_img} alt='cafe' style={{ height:'200px', margin:'20px 0px', borderRadius:'20px' }} />
                <div>
                    <Button
                        id={props.id}
                        variant='contained'
                        sx={{ borderRadius: '30px', marginRight: '10px' }}
                        onClick={handleFeedbackOpen}
                    >
                        See Feedback
                    </Button>
                    <Button
                        variant='contained'
                        sx={{ borderRadius: '30px' }}
                        startIcon={<DeleteIcon />}
                        onClick={() => props.deleteCanteen(props.id)}
                    >
                        Delete
                    </Button>
                </div>
                <FeedbackModal open={feedbackOpen} handleClose={handleFeedbackClose} canteenId={props.id} />
            </div>
        </ThemeProvider>
    );
}

export default Card;
