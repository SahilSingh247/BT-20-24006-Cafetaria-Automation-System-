import React, { useState, useEffect } from 'react';
import { Button, Typography, createTheme } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { ThemeProvider } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import Empty_Cart from '../general_compo/empty_cart.png';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#FAF9F6',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
  border: 'none',
  boxShadow: 'none'
}));

const CartContent = (props) => {
  const theme = createTheme({
    palette: {
      primary: { main: '#e57417' },
      secondary: green
    }
  });

  let cartItems = [];

  if (props.cartDetails.length !== 0) {
    cartItems = props.cartDetails.items.map((item) => {
      if (item.quantity !== 0) {
        return (
          <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid container spacing={0.3}>
              <Grid item xs={4}>
                <Item sx={{ margin: '15px' }}>
                  <Typography variant="h6">{item.name}</Typography>
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ margin: '15px' }}>
                  <Typography variant="h6">{item.quantity}</Typography>
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ margin: '15px' }}>
                  <Typography variant="h6">{item.price}</Typography>
                </Item>
              </Grid>
            </Grid>
          </div>
        );
      } else {
        return null; // Return null for items with quantity 0
      }
    });
  }

  // Filter out null values from the cartItems array
  cartItems = cartItems.filter((item) => item !== null);
  const [isDone, setIsDone] = useState(false);

  const loadAndRunScript = () => {
    if (document.getElementById('razorpay-script')) {
      return; // Prevent reloading the script if it already exists
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
    script.setAttribute('data-payment_button_id', 'pl_HixkxnGbooqfrB');
    script.async = true;
    script.id = 'razorpay-script'; // Assign an ID to the script element

    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setIsDone(true);
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay script');
    };

    document.getElementById('razorpay-form').appendChild(script);
    setIsDone(true);
  };

  const handleButtonClick = () => {
    loadAndRunScript();
    if(isDone){
      props.payment(props.cartDetails.id);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Background */}
      {props.cartDetails.length === 0 || cartItems.length === 0 ? (
        <div>
          <img src={Empty_Cart} alt='emptycart' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '70px', paddingLeft: '140px' }} />
          <Typography variant="h4" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '100px', width: '400px', paddingLeft: '55px' }}>Your cart is empty.</Typography>
          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '50px', color: 'grey', width: '400px', paddingLeft: '55px' }}>Looks like you haven't made</Typography>
          <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'grey', width: '400px', paddingLeft: '55px' }}>your menu yet.</Typography>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', width: '460px' }}>
            <Button variant='contained' sx={{ borderRadius: '30px' }} onClick={() => { props.drawerButton(props.anchor, false) }}>
              <EastIcon />
            </Button>
            <Typography variant='h5' sx={{ marginLeft: '30px', fontWeight: 'bold' }}>Cart Content: {props.cartDetails.order_canteen_name}</Typography>
          </div>
          {/* Box to show items that customer wants to purchase */}
          <div style={{ border: '2px solid white', borderRadius: '30px', width: '460px', margin: '5px', marginTop: '40px', padding: '5px', marginLeft: '-4px' }}>
            <Grid container spacing={0.3} sx={{ marginBottom: '20px', border: 'none', boxShadow: 'none' }}>
              <Grid item xs={4}>
                <Item sx={{ backgroundColor: '#DED8D8' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Name</Typography>
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ backgroundColor: '#DED8D8' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Quantity</Typography>
                </Item>
              </Grid>
              <Grid item xs={4}>
                <Item sx={{ backgroundColor: '#DED8D8' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Price</Typography>
                </Item>
              </Grid>
            </Grid>
            {cartItems}
          </div>
          {/* Box to show the final summary of the items */}
          <div style={{ borderRadius: '30px', border: '2px solid white', width: '452px', margin: '5px', padding: '10px', marginTop: '50px', marginBottom: '50px', marginLeft: '-5px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h4" sx={{ margin: '20px', fontWeight: 'bold' }}>Order Summary</Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Subtotal</Typography>
              <Typography variant="h6">{props.cartDetails.total_amount}</Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Convenience fee</Typography>
              <Typography variant="h6">0</Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Tax</Typography>
              <Typography variant="h6">0</Typography>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">{props.cartDetails.total_amount}</Typography>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <form id="razorpay-form">
                <Button
                  variant='contained'
                  sx={{ borderRadius: '30px', margin: '20px 0px 5px 0px', width: '300px', padding: '10px' }}
                  endIcon={<EastIcon />}
                  onClick={handleButtonClick}
                >
                  {!isDone ? 'Continue to Payment' : 'Checkout'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
};

export default CartContent;
