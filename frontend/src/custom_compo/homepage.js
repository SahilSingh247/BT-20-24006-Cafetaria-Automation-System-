//importing css
import '../App.css';

//importing MUI cmp
import { Typography, createTheme } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { Link } from '@mui/material';
import { Link as LINK } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

//importing images
import logo from '../general_compo/logo.png'
import home_image from '../home_compo/home_image.png';
import del_man from "../home_compo/del_man.png";
import home_3_1 from "../home_compo/1_3_1.png";
import home_3_2 from "../home_compo/1_3_2.png";
import home_3_3 from "../home_compo/1_3_3.png";
import cafe from "../general_compo/cafe.png";

//importing react cmp
import { useState, useEffect } from 'react';

//importing custom components
import Specialities from '../home_compo/specialities';
import CartContent from './cartContent.js';
import AccountContent from './accountContent.js';
import Loading from './loading.js';


//defining theme
const theme = createTheme({
    palette: {
        primary: { main: "#e57417" },
        secondary: green
    }
})

function HomePage() {

    const [accountDetails, setAccountDetails] = useState()
    const [gotAccountDetails, setGotAccountDetails] = useState(false)
    const [cartDetails, setCartDetails] = useState()
    const [gotCartDetails, setGotCartDetails] = useState(false)


    const apiUrl = "http://127.0.0.1:8000/get-account-details"
    const token = JSON.parse(localStorage.getItem('token'))

    useEffect(()=>{
        if(!token){
            window.location.href = "/"
        }
    })

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
                    // window.location.href = "/"
                }
            })
            .then(data => {
                if (data.type == "Canteen") {
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

    const apiUrlCart = "http://127.0.0.1:8000/get-cust-orders"

    useEffect(() => {
        if(token){

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
        }
    }, [])

    useEffect(() => {
        const refreshToken = token.refresh; // Replace with your actual refresh token
        const refreshAccessToken = () => {
            console.log("hi")
            const apiRefresh = "http://127.0.0.1:8000/refresh"
            if(token){
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
            }
        };

        // Set up a timer to refresh the access token every 10 minutes
        const intervalId = setInterval(refreshAccessToken, 50 * 60 * 1000); // 10 minutes

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

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
        if(token){
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
    }

    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            {gotAccountDetails && gotCartDetails ? <div style={{ backgroundColor: '#DED8D8', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {/* first box */}
                <div style={{ borderRadius: '108px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', height: '732px', boxShadow: '0px 10px 5px darkgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {/* padding box */}
                    <div style={{ width: '1191px', height: '632px' }}>
                        {/* header div / Navigation bar */}
                        <div style={{ display: 'flex', height: '70px', justifyContent: 'center', marginTop: '20px' }}>
                            <img src={logo} alt='website logo' style={{ marginRight: '70px', height: '80px' }} />
                            <div style={{ display: 'flex', boxShadow: '0px 2px 0px darkGrey', paddingBottom: '10px', marginTop: '10px' }}>
                                <LINK to="/home" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Home</Button></LINK>
                                <LINK to="/home/feedback" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Feedback</Button></LINK>
                                <LINK to="/home/pendingOrders" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >Pending Orders</Button></LINK>
                                <LINK to="/home/allOrders" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >All Orders</Button></LINK>
                                <LINK to="/home/aboutus" ><Button style={{ color: 'black', marginRight: '20px', marginTop: '10px', fontWeight: 'bold' }} >About Us</Button></LINK>
                                <LINK to="/home/contact" ><Button style={{ color: 'black', marginRight: '60px', marginTop: '10px', fontWeight: 'bold' }}>Contact</Button></LINK>


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
                        {/* child box of pading box */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px', marginLeft: '100px' }}>
                            <div style={{ width: '450px' }}>
                                <Typography variant='h3'>Order food online from your room lazy? No worries!</Typography>
                                <Typography color='primary' style={{ marginTop: '20px' }}>Freshly made food delivered to your door.</Typography>
                                <LINK to="/home/canteens" ><Button variant='contained' style={{ borderRadius: '30px', marginTop: '40px', height: '50px' }} >Order now</Button></LINK>
                            </div>
                            <div style={{ marginLeft: '70px' }}>
                                <img src={home_image} alt='home_image' style={{ height: '400px' }} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* second box */}
                <div style={{ borderRadius: '108px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', height: '582px', boxShadow: '0px 10px 5px darkgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {/* padding box */}
                    <div style={{ width: '1191px', height: '532px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div>
                            <Typography variant='h3' style={{ marginBottom: '30px' }}>Explore your favourite cafe's food.</Typography>
                            <Typography>Discover a world of culinary delights at your fingertips. Explore a diverse menu, from savory classics to innovative creations, all ready to tantalize your taste buds. Order online and let us bring the flavors of your favorite canteens right to your doorstep.</Typography>
                            {/*<Button variant="contained" endIcon={<EastIcon />} style={{ borderRadius: '30px', marginTop: '50px', height: '50px' }}>Explore</Button>*/}
                        </div>
                        <div>
                            <img src={del_man} alt='Delivery man' style={{ height: '500px' }} />
                        </div>
                    </div>
                </div>
                {/* third box */}
                <div style={{ borderRadius: '108px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', height: '582px', boxShadow: '0px 10px 5px darkgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '1191px', height: '532px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Specialities key="one" id="one" image={home_3_3} title="Wide selection of FOOD!" description="Enjoy an extensive menu featuring dishes from around the world. Whether you're in the mood for classic comfort food or adventurous flavors, we've got something to please every palate. Explore our wide variety of delicious options and find your new favorites today!" />
                        <Specialities key="two" id="two" image={home_3_2} title="Easy order placing!" description="Ordering made simple! With just a few clicks, enjoy hassle-free meal selection and speedy checkout. Say goodbye to long queues and complicated processes - experience easy, straightforward ordering for a delicious dining experience delivered right to your doorstep." />
                        <Specialities key="three" id="three" image={home_3_1} title="Fast preparation within 20 mins" description="Quick and fresh! Our promise: savory meals prepared swiftly in under 20 minutes. Enjoy the convenience of speedy service without compromising on taste or quality. Order now for a deliciously fast dining experience delivered straight to you." />
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
                        <div style={{ marginBottom: "20px" }}><Link href="https://www.facebook.com/" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"Facebook"}</Link></div>
                        <div style={{ marginBottom: "20px" }}><Link href="https://twitter.com/" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"Twitter"}</Link></div>
                        <div style={{ marginBottom: "20px" }}><Link href="https://instagram.com/" underline="hover" target="_blank" style={{ color: '#DAC6C7' }} >{"Instagram"}</Link></div>
                    </div>
                </footer>
            </div> : <Loading />}
        </ThemeProvider>
    )
}

export default HomePage;