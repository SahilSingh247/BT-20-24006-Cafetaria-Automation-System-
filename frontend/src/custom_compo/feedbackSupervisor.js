// Importing necessary libraries and components
import '../App.css';
import { Typography, createTheme } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { Link } from '@mui/material';
import { Link as LINK, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import * as React from 'react';
import { useEffect, useState } from 'react';
import AccountContent from './accountContent.js';
import Loading from './loading.js';

// Defining the theme
const theme = createTheme({
    palette: {
        primary: { main: "#e57417" },
        secondary: green
    }
})

function FeedbackSupervisor() {
    const [accountDetails, setAccountDetails] = useState()
    const [gotAccountDetails, setGotAccountDetails] = useState(false)
    const [data, setData] = useState()
    const [porder, setporder] = useState()
    const [isLoaded, setIsLoaded] = useState(false)
    const { canteen_id } = useParams()
    const apiUrlAcount = "http://127.0.0.1:8000/get-account-details"
    const token = JSON.parse(localStorage.getItem('token'))

    // Redirect if no token is found
    useEffect(()=>{
        if(!token){
            window.location.href = "/"
        }
    })

    // Fetch account details
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
                    throw new Error('Failed to fetch account details');
                }
            })
            .then(data => {
                if (data.type !== "Supervisor") {
                    window.location.href = "/unauth"
                } else {
                    setAccountDetails(data)
                    setGotAccountDetails(true)
                }
            })
            .catch(error => console.error('Error:', error));
    }, [])

    // Fetch feedback data
    const apiUrlPOrder = `http://127.0.0.1:8000/get-all-feedback/${canteen_id}`

    useEffect(() => {
        fetch(apiUrlPOrder, {
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
                setData(data);
                setporder(data.map((item, index) => {
                    return (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <Typography variant="h6">Order ID: {item.order_id}</Typography>
                            <Typography variant="body1">Feedback: {item.feedback}</Typography>
                        </div>
                    )
                }))
                setIsLoaded(true)
            })
            .catch(error => console.error('Error:', error));
    }, [canteen_id])

    // State for drawer
    const [state, setState] = React.useState({
        right: false,
        left: false
    });

    // Function for toggling the drawer
    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
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

    // List of items to display in the cart drawer
    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
        >
            {anchor === "right" ? <div></div> : <AccountContent drawerButton={drawerButton} anchor={anchor} accountDetails={accountDetails} signOut={handleSignOut} />}
        </Box>
    );

    const handleSignOut = () => {
        const userConfirm = window.confirm("Do you want to Sign Out?")
        if (userConfirm) {
            localStorage.removeItem('token')
            window.location.href = "/"
        }
    }

    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            {gotAccountDetails && isLoaded ? <div style={{ backgroundColor: '#DED8D8', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {/* first box */}
                <div style={{ borderRadius: '108px', padding: '30px 0px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', boxShadow: '0px 10px 5px darkgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* padding box */}
                    <div style={{ width: '1191px' }}>
                        {/* header div / Navigation bar */}
                        <div style={{ display: 'flex', height: '70px', justifyContent: 'center', marginTop: '50px' }}>
                            <img src={logo} alt='website logo' style={{ marginRight: '250px', height: '80px' }} />
                            <div style={{ display: 'flex', boxShadow: '0px 2px 0px darkGrey', paddingBottom: '10px', marginTop: '10px' }}>
                                <LINK to={`/s_canteen/${canteen_id}`}><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Home</Button></LINK>
                                <LINK to={`/s_canteen/stats/${canteen_id}`}><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Stats</Button></LINK>
                                <LINK to={`/s_canteen/feedbackSupervisor/${canteen_id}`}><Button variant='contained' style={{ borderRadius: '50px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Feedback</Button></LINK>
                            </div>
                        </div>
                        {/* child box of padding box */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '60px' }}>
                            <Typography variant='h4' style={{ color: 'black', textDecoration: 'underline' }}> Feedback for Canteen </Typography>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                            {porder}
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
                        <Typography style={{ color: 'white', fontWeight: 'bold', marginBottom: '50px' }}>Contact</Typography>
                        <div style={{ marginBottom: "20px" }}><Link href="https://www.facebook.com/people/Quick-Cafe/61553677053607/" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"Facebook"}</Link></div>
                        <div style={{ marginBottom: "20px" }}><Link href="https://twitter.com/FastCafe@DA69" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"Twitter"}</Link></div>
                        <div style={{ marginBottom: "20px" }}><Link href="https://instagram.com/_quick_cafe?igshid=OGQ5ZDc2ODk2ZA==" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"Instagram"}</Link></div>
                        <div style={{ marginBottom: "20px" }}><Link href="https://www.youtube.com/@quickcafeda" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"YouTube"}</Link></div>
                    </div>
                </footer>
            </div> : <Loading />}
        </ThemeProvider>
    );
}

export default FeedbackSupervisor;
