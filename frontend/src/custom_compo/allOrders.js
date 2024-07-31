//importing css
import '../App.css';

//importing MUI cmp
import { Typography } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Link } from '@mui/material';
import { Link as LINK } from 'react-router-dom';

//importing custom cmp
import theme from '../general_compo/theme.js';
import Order from './order.js';
import AccountContent from './accountContent.js';
import Loading from './loading.js';

//importing router
import { useParams } from 'react-router-dom';

//importing images
import logo from '../general_compo/logo.png';
import cafe from "../general_compo/cafe.png";

//importing react cmp
import * as React from 'react';
import { useEffect, useState } from 'react';

function AllOrders() {

    const [isLoaded, setIsLoaded] = useState(false)
    const [order, setOrder] = useState()

    const [accountDetails, setAccountDetails] = useState()
    const [gotAccountDetails, setGotAccountDetails] = useState(false)

    const apiUrlAccount = "http://127.0.0.1:8000/get-account-details"
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
        fetch(apiUrlAccount, {
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
                if (data.type == "Customer") {
                    window.location.href = "/unauth"
                }
                else {
                    console.log(data);
                    setAccountDetails(data)
                    setGotAccountDetails(true)
                }
            })
            .catch(error => console.error('Error:', error));
    }, [])


    const apiUrl = "http://127.0.0.1:8000/get-orders"

    useEffect(() => {
        fetch(apiUrl, {
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
                // Handle the response data here
                console.log(data);
                setOrder(data.map((item) => (<Order id={item.id} name={item.order_cust_name} phone={item.order_cust_contact} email={item.order_cust_email} status={item.status} totalAmount={item.total_amount} items={item.items} flag={0} date={item.date} />)))
                setIsLoaded(true)
            })
            .catch(error => console.error('Error:', error));
    }, [])

    //state for drawer
    const [state, setState] = React.useState({
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
        //onClick={toggleDrawer(anchor, false)}
        //onKeyDown={toggleDrawer(anchor, false)}
        >
            {<AccountContent drawerButton={drawerButton} anchor={anchor} accountDetails={accountDetails} signOut={handleSignOut} />}
        </Box>
    );

    const handleSignOut = () => {
        const userConfirm = window.confirm("Do you want to Sign Out?")
        if (userConfirm) {
            localStorage.removeItem('token')
            window.location.href = "/"
        }
    }

    const id = useParams()

    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            {isLoaded && gotAccountDetails ?
                < div style={{ backgroundColor: '#DED8D8', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    {/* first box */}
                    <div style={{ borderRadius: '108px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', padding: "30px 0px", boxShadow: '0px 10px 5px darkgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {/* padding box */}
                        <div style={{ width: '1191px' }}>
                            {/* header div / Navigation bar */}
                            <div style={{ display: 'flex', height: '70px', justifyContent: 'center', marginTop: '50px' }}>
                                <img src={logo} alt='website logo' style={{ marginRight: '150px', height: '80px' }} />
                                <div style={{ display: 'flex', boxShadow: '0px 2px 0px darkGrey', paddingBottom: '10px', marginTop: '10px' }}>
                                    <LINK to={`/cownerHome/${id.id}`}><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Home</Button></LINK>
                                    <LINK to={`/cownerHome/stats/${id.id}`}><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Stats</Button></LINK>
                                    <LINK to={`/cownerHome/feedbackCanteen/${id.id}`}><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Feedback</Button></LINK>
                                    <LINK to={`/cownerHome/pendingOrders/${id.id}`}><Button variant='contained' style={{ borderRadius: '50px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Pending Orders</Button></LINK>
                                    <LINK to={`/cownerHome/allOrders/${id.id}`}><Button variant='contained' style={{ borderRadius: '50px', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >All orders</Button></LINK>
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
                                </div>
                            </div>
                            {/* child box of padding box */}
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '70px' }}>
                                <Typography variant='h2'><u>All Orders</u></Typography>
                            </div>
                            {/* child box of padding box */}
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                                {order}
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
                </div> : <Loading />
            }

        </ThemeProvider >
    )
}

export default AllOrders;