import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Box, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, orange } from '@mui/material/colors';
import StarIcon from '@mui/icons-material/Star';

const theme = createTheme({
    palette: {
        primary: { main: orange[500] },
        secondary: green
    },
    typography: {
        h6: {
            fontWeight: 600,
        },
        body1: {
            fontSize: 16,
        },
        body2: {
            color: "#555",
        },
    }
});

const FeedbackModal = ({ open, handleClose, canteenId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const token = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        if (open) {
            fetch(`http://127.0.0.1:8000/get-all-feedback/${canteenId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.access}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setFeedbacks(data);
                setLoading(false);
                calculateAverageRating(data);
            })
            .catch(error => {
                console.error('Error fetching feedback:', error);
                setLoading(false);
            });
        }
    }, [open, canteenId, token]);

    const calculateAverageRating = (feedbacks) => {
        if (feedbacks.length === 0) {
            setAverageRating(0);
            return;
        }
        const totalRating = feedbacks.reduce((total, feedback) => total + feedback.rating, 0);
        const avgRating = totalRating / feedbacks.length;
        setAverageRating(avgRating.toFixed(2)); // Keep two decimal places for average rating
    };

    return (
        <ThemeProvider theme={theme}>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Feedback</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Typography variant="h6" component="div" mr={1}>Average Rating: {averageRating}</Typography>
                                <StarIcon style={{ color: orange[500] }} />
                            </Box>
                            {feedbacks.length > 0 ? (
                                feedbacks.map((feedback, index) => (
                                    <Box key={index} mb={3} p={2} border={1} borderColor="#e0e0e0" borderRadius={8}>
                                        <Typography variant="body1" gutterBottom>Order ID: {feedback.order_id}</Typography>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <Typography variant="body1">Rating: {feedback.rating} Star{feedback.rating > 1 ? 's' : ''}</Typography>
                                            <Avatar style={{ marginLeft: 8, backgroundColor: orange[500], width: 24, height: 24 }}>
                                                <StarIcon style={{ fontSize: 16, color: "#fff" }} />
                                            </Avatar>
                                        </Box>
                                        <Typography variant="body2">{feedback.feedback}</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography>No feedback available.</Typography>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
};

export default FeedbackModal;
