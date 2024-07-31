//importing css
import '../App.css';

//importing MUI cmp
import { Typography,Rating } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';

//importing custom cmp
import theme from "../general_compo/theme.js";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#FAF9F6',
    // ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
}));

function PastOrderC(props) {
    const [orderID,setorderID]=React.useState(props.id)
    const displayOrders = props.items.map((item) => {
        if (item.quantity !== 0) {
            return (<div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Grid container spacing={0.3}>
                    <Grid item xs={4}>
                        <Item><Typography>{item.name}</Typography></Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item><Typography>{item.quantity}</Typography></Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item><Typography>{item.price}</Typography></Item>
                    </Grid>
                </Grid>
            </div>)
        }
        else {
            return
        }

    })

    return (
        //displaying order
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '40px', backgroundColor: '#E9DCDC', borderRadius: '30px', margin: '20px', width: '1100px' }}>
                <div>
                    <Typography variant='h3' sx={{ marginBottom: '30px' }}>Order Details</Typography>
                    <Typography variant='h5' sx={{ marginBottom: '30px' }}>{props.name}</Typography>
                    <Grid container spacing={0.3} sx={{ marginBottom: '20px', border: 'none', boxShadow: 'none' }}>
                        <Grid item xs={4}>
                            <Item><Typography sx={{ fontWeight: 'bold' }}>Name</Typography></Item>
                        </Grid>
                        <Grid item xs={4}>
                            <Item><Typography sx={{ fontWeight: 'bold' }}>Quantity</Typography></Item>
                        </Grid>
                        <Grid item xs={4}>
                            <Item><Typography sx={{ fontWeight: 'bold' }}>Price</Typography></Item>
                        </Grid>
                    </Grid>
                    {displayOrders}
                    <Typography variant='h6' sx={{ marginTop: '50px' }}>Total amount: {props.totalAmount}</Typography>
                    <Typography>Order ID : {orderID}</Typography>
                    <Rating
                          name="simple-controlled"
                          value={props.rating}
                        />
                    <Typography>Date and Time : {props.date}</Typography>
                </div>
                <div>
                    <div style={{ margin: '15px 0px' }}>
                        <Typography variant='h4' sx={{ marginBottom: '30px' }}>Feedback</Typography>
                        <div style={{ backgroundColor: '#E9DCDC', width: '350px', borderRadius: '30px', padding: '20px', border: 'solid 2px white', boxShadow: '2px 2px 5px' }}>
                            <Typography variant='h7' >{props.feedback}</Typography>
                        </div>
                    </div>

                </div>
            </div>
        </ThemeProvider>
    )
}

export default PastOrderC;