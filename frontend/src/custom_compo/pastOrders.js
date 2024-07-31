import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Rating, Grid, Paper } from '@mui/material';

function PastOrder({ id, totalAmount, name, items = [], feedback = [], changeFeedBack, onButtonClick, date }) {
  // Initialize state for item ratings
  const [itemRatings, setItemRatings] = useState({});

  useEffect(() => {
    // Initialize item ratings based on feedback
    const initialRatings = items.reduce((acc, item) => {
      const feedbackItem = feedback.find(f => f.order_id === id);
      acc[item.id] = feedbackItem?.item_rating?.[item.id] || 0;
      return acc;
    }, {});
    setItemRatings(initialRatings);
  }, [items, feedback, id]);

  const handleFeedbackChange = (event) => {
    const feedbackItem = feedback.find(item => item.order_id === id) || {};
    changeFeedBack(id, event.target.value, feedbackItem.rating || 0, itemRatings);
  };

  const handleRatingChange = (event, newRating) => {
    const feedbackItem = feedback.find(item => item.order_id === id) || {};
    changeFeedBack(id, feedbackItem.feedback || '', newRating, itemRatings);
  };

  const handleItemRatingChange = (itemId, newRating) => {
    setItemRatings(prevRatings => {
      const updatedRatings = {
        ...prevRatings,
        [itemId]: newRating
      };
      // Update item rating in parent component
      changeFeedBack(id, feedback.find(item => item.order_id === id)?.feedback || '', feedback.find(item => item.order_id === id)?.rating || 0, updatedRatings);
      return updatedRatings;
    });
  };

  // Filter items to only show those with quantity > 0
  const filteredItems = items.filter(item => item.quantity > 0);

  return (
    <Paper style={{ padding: '20px', margin: '10px', width: '100%' }}>
      <Typography variant='h6'>Order from {name}</Typography>
      <Typography variant='body1'>Date: {date}</Typography>
      <Typography variant='body1'>Total Amount: ${totalAmount}</Typography>
      
      <Box mt={2}>
        <Typography variant='h6'>Items</Typography>
        <Grid container spacing={2}>
          {filteredItems.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Box border={1} borderRadius={2} p={2}>
                <Typography variant='body1'>{item.name}</Typography>
                <Typography variant='body2'>{item.desc}</Typography>
                <Typography variant='body2'>Price: ${item.price}</Typography>
                <Typography variant='body2'>Quantity: {item.quantity}</Typography>
                
                {/* Display and allow rating for items */}
                <Box mt={1}>
                  <Typography variant='body2'>Rating:</Typography>
                  <Rating
                    name={`item-rating-${item.id}`}
                    value={itemRatings[item.id]}
                    onChange={(event, newValue) => handleItemRatingChange(item.id, newValue)}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Feedback Section */}
      <Box mt={2}>
        <Typography variant='h6'>Your Feedback</Typography>
        <TextField
          label='Feedback'
          multiline
          rows={4}
          value={feedback.find(item => item.order_id === id)?.feedback || ''}
          onChange={handleFeedbackChange}
          fullWidth
        />
        <Box mt={1}>
          <Typography variant='body2'>Overall Rating:</Typography>
          <Rating
            name='overall-rating'
            value={feedback.find(item => item.order_id === id)?.rating || 0}
            onChange={handleRatingChange}
          />
        </Box>
        <Button variant='contained' color='primary' onClick={() => onButtonClick(id)}>
          Submit Feedback
        </Button>
      </Box>
    </Paper>
  );
}

export default PastOrder;
