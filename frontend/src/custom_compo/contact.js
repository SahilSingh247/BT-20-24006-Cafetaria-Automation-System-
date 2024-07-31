//importing css
import '../App.css';

//importing MUI cmp

import { Typography, createTheme } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from '@mui/material';
import { Link as LINK } from 'react-router-dom';

import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

//importing photos
import logo from '../general_compo/logo.png'
import cafe from "../general_compo/cafe.png"

//importing react cmp
import { useEffect, useState } from 'react';


//importing custom cmp
import CartContent from './cartContent.js';
import AccountContent from './accountContent.js';
import Loading from './loading.js';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#FAF9F6',
    // ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.primary,
    border: 'none',
    boxShadow: 'none'
}));

//defining theme
const theme = createTheme({
    palette: {
        primary: { main: "#e57417" },
        secondary: green
    }
})

function Contact() {

    const [accountDetails, setAccountDetails] = useState()
    const [gotAccountDetails, setGotAccountDetails] = useState(false)
    const [cartDetails, setCartDetails] = useState()
    const [gotCartDetails, setGotCartDetails] = useState(false)

    const apiUrlAcount = "http://127.0.0.1:8000/get-account-details"

    const token = JSON.parse(localStorage.getItem('token'))
    useEffect(()=>{
        if(!token){
            window.location.href = "/"
        }
    })
    
    useEffect(() => {
        const refreshToken = token.refresh; // Replace with your actual refresh token

        const refreshAccessToken = () => {
            const apiRefresh = "http://127.0.0.1:8000/refresh"
            fetch(apiRefresh, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.access}`
                },
                body: JSON.stringify({
                    "refresh": refreshToken,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to refresh access token');
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log(data)
                    localStorage.setItem('token', data)
                })
                .catch((error) => {
                    console.error('Error refreshing access token:', error);
                });
        };

        // Set up a timer to refresh the access token every 10 minutes
        const intervalId = setInterval(refreshAccessToken, 50 * 60 * 1000); // 10 minutes

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        fetch(apiUrlAcount, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    // window.location.href = "/"
                }
            })
            .then(data => {
                if(data.type=="Canteen"){
                    window.location.href="/unauth"
                }
                // Handle the response data here
                console.log(data);
                setAccountDetails(data)
                setGotAccountDetails(true)
            })
            .catch(error => console.error('Error:', error));
    }, [])

    const apiUrlCart = "http://127.0.0.1:8000/get-cust-orders"

    useEffect(() => {
        fetch(apiUrlCart, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                if (data.length === 0) setCartDetails(data)
                else if (data[data.length - 1].status !== "AddedToCart") setCartDetails([])
                else setCartDetails(data[data.length - 1])
                setGotCartDetails(true)
            })
            .catch(error => console.error('Error:', error));
    }, [])


    //state for drawer
    const [state, setState] = React.useState({
        right: false,
        left: false
    });

    //function for toggling the drawer
    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const closeButton = (anchor, status) => {
        setState({ ...state, [anchor]: status });
    }

    const drawerButton = (anchor, status) => {
        closeButton(anchor, status)
    }

    //list of all the items we need to display in the cart drawer
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
        >
            {anchor === "right" ? <CartContent drawerButton={drawerButton} anchor={anchor} cartDetails={cartDetails} payment={handlePayment} /> : <AccountContent drawerButton={drawerButton} anchor={anchor} accountDetails={accountDetails} signOut={handleSignOut} />}
        </Box>
    );

    const handleSignOut = () => {
        const userConfirm = window.confirm("Do you want to Sign Out?")
        if (userConfirm) {
            localStorage.removeItem('token')
            window.location.href = "/"
        }
    }

    const handlePayment = (order_id) => {
        const apiPayment = "http://127.0.0.1:8000/confirm-order"
        fetch(apiPayment, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`
            },
            body: JSON.stringify({
                "order_id": order_id
            }),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => {
                alert("Payment Successful")
                window.location.reload()
            })
            .catch(error => console.error('Error:', error));
    }

    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            {gotAccountDetails && gotCartDetails ? <div style={{ backgroundColor: '#DED8D8', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {/* first box */}
                <div style={{ borderRadius: '108px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', boxShadow: '0px 10px 5px darkgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* padding box */}
                    <div style={{ width: '1191px', padding:'30px'}}>
                        {/* header div / Navigation bar */}
                        <div style={{ display: 'flex', height: '70px', justifyContent: 'center', marginTop: '70px' }}>
                            <img src={logo} alt='website logo' style={{ marginRight: '70px', height: '80px' }} />
                            <div style={{ display: 'flex', boxShadow: '0px 2px 0px darkGrey', paddingBottom: '10px', marginTop: '10px' }}>
                                <LINK to="/home" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Home</Button></LINK>
                                <LINK to="/home/feedback" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Feedback</Button></LINK>
                                <LINK to="/home/pendingOrders" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Pending Orders</Button></LINK>
                                <LINK to="/home/allOrders" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >All Orders</Button></LINK>
                                <LINK to="/home/aboutus" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >About Us</Button></LINK>
                                <LINK to="/home/contact" ><Button style={{ color: 'black', marginRight: '60px', marginTop: '10px', fontWeight: 'bold' }} >Contact</Button></LINK>

                                {/* drawer for cart */}
                                {['left'].map((anchor) => (
                                    <React.Fragment key={anchor}>
                                        <Button variant='contained' style={{ borderRadius: '30px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} onClick={toggleDrawer(anchor, true)}>Account</Button>
                                        <SwipeableDrawer
                                            anchor={anchor}
                                            open={state[anchor]}
                                            onClose={toggleDrawer(anchor, false)}
                                            onOpen={toggleDrawer(anchor, true)}
                                            PaperProps={{ style: { borderTopRightRadius: '30px', backgroundColor: '#DED8D8', padding: '20px', width: '480px' } }}
                                        >
                                            {list(anchor)}
                                        </SwipeableDrawer>
                                    </React.Fragment>
                                ))}
                                {['right'].map((anchor) => (
                                    <React.Fragment key={anchor}>
                                        <Button variant='contained' startIcon={<ShoppingCartIcon />} style={{ borderRadius: '50px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} onClick={toggleDrawer(anchor, true)}>{cartDetails.total_quantity ? cartDetails.total_quantity : 0}</Button>
                                        <SwipeableDrawer
                                            anchor={anchor}
                                            open={state[anchor]}
                                            onClose={toggleDrawer(anchor, false)}
                                            onOpen={toggleDrawer(anchor, true)}
                                            PaperProps={{ style: { borderTopLeftRadius: '30px', backgroundColor: '#DED8D8', padding: '20px', width: '480px' } }}
                                        >
                                            {list(anchor)}
                                        </SwipeableDrawer>
                                    </React.Fragment>
                                ))}

                            </div>
                        </div>
                        {/* child box of padding box */}
                        <div style={{ display: 'flex', justifyContent: 'center',flexDirection:'column',alignItems:'center', marginTop: '60px' }}>
                            <Typography variant='h4' style={{ color: '#e57417', marginBottom:'50px' }}> Members </Typography>
                            <div style={{width:'600px', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                            <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Dhruvilsinh Thakor</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101462</Typography></Item>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Vrajkumar Patel</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101060</Typography></Item>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Vandan Bhuva</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101404</Typography></Item>
                            </Grid>
                        </Grid>             

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Yash Kodwani</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101418</Typography></Item>
                            </Grid>
                        </Grid>
                        
                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Dweej Pandya</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101432</Typography></Item>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Krishna Choksi</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101459</Typography></Item>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Kalhar Patel</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101009</Typography></Item>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Umang Trivedi</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101471</Typography></Item>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Mihir Gohel</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101473</Typography></Item>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Shrut Kalathiya</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101479</Typography></Item>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Shrey Khakhariya</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101493</Typography></Item>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: '20px', padding: '10px', border: 'none', boxShadow: 'none' }}>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>Jay Dobariya</Typography></Item>
                            </Grid>
                            <Grid item xs={6}>
                                <Item sx={{ backgroundColor: '#DED8D8' }}><Typography variant="h6" sx={{ fontWeight: 'bold' }}>202101521</Typography></Item>
                            </Grid>
                        </Grid>
                        </div>
                        </div>
                        

                    </div>
                </div>
                {/* footer */}
                <footer style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#e57417', width: '100%', marginTop: '70px', paddingTop: '10px' }}>
                    <div style={{ width: '500px', padding: '50px' }}>
                        <img src={cafe} alt='cafe' style={{ width: '200px' }} />
                        <Typography style={{ color: '#DAC6C7' }}>At FastCafe@DA our core beliefs drive everything we do. We believe in the power of innovation to revolutionize the way people experience food and dining. We're passionate about harnessing technology to make dining experiences more convenient, efficient, and enjoyable for everyone.</Typography>
                    </div>
                    <div style={{ padding: '50px' }}>
                        <Typography style={{ color: 'white', fontWeight: 'bold', marginBottom: '50px' }}>Quick links</Typography>
                        <div style={{ marginBottom: "20px" }}><Link component={LINK} to="/home/canteens" underline="hover" style={{ color: '#DAC6C7' }} >{"Browse Food"}</Link></div>
                        <div style={{ marginBottom: "20px" }}><Link component={LINK} to="/home/aboutus" underline="hover" style={{ color: '#DAC6C7' }} >{"Registrations"}</Link></div>
                    </div>
                    <div style={{ padding: '50px' }}>
                        <Typography style={{ color: 'white', fontWeight: 'bold', marginBottom: '50px' }}>About</Typography>
                        <div style={{ marginBottom: "20px" }}><Link href="/home/aboutus" underline="hover" style={{ color: '#DAC6C7' }} >{"About Us"}</Link></div>
                        <div style={{ marginBottom: "20px" }}><Link href="/home" underline="hover" style={{ color: '#DAC6C7' }} >{"Mission"}</Link></div>
                    </div>
                    <div style={{ padding: '50px' }}>
                        <Typography style={{ color: 'white', fontWeight: 'bold', marginBottom: '50px' }}>Contact</Typography>
                        <div style={{ marginBottom: "20px" }}><Link href="https://www.facebook.com/people/Quick-Cafe/61553677053607/" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"Facebook"}</Link></div>
                        <div style={{ marginBottom: "20px" }}><Link href="https://twitter.com/FastCafe@DA69" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"Twitter"}</Link></div>
                        <div style={{ marginBottom: "20px" }}><Link href="https://instagram.com/_quick_cafe?igshid=OGQ5ZDc2ODk2ZA==" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"Instagram"}</Link></div>
                    </div>
                </footer>
            </div> : <Loading />}
        </ThemeProvider>
    )
}

export default Contact;