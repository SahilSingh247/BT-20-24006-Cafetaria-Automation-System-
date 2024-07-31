//importing css
import '../App.css';

//importing MUI cmp
import { Typography, TextField } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import Button from '@mui/material/Button';
import { Link } from '@mui/material';
import { Link as LINK } from 'react-router-dom';

import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

//importing custom cmp
import theme from '../general_compo/theme.js';
import OwnMenuCard from './ownMenuCard';
import AccountContent from './accountContent.js';
import Loading from './loading.js';

//importing images
import logo from '../general_compo/logo.png';
import cafe from "../general_compo/cafe.png";

//importing react cmp
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CownerHome() {


    //if (altered_menu_data.length===0)return <Navigate to='/error' replace={true}/>
    const [isLoaded, setIsLoaded] = useState(false)
    const [menu, setMenu] = useState()
    const [data, setData] = useState()
    const [accountDetails, setAccountDetails] = useState()
    const [gotAccountDetails, setGotAccountDetails] = useState(false)
    const [newItem, setNewItem] = useState({ "name": "", "price": 0 })
    const [toggleAdd, setToggleAdd] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const [color, setColor] = useState(false)
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
    const apiUrlDisable = "http://127.0.0.1:8000/disable-items"; 

    const handleDisableItem = (id) => {
        fetch(apiUrlDisable, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.access}`
            },
            body: JSON.stringify({ item_id: id }),
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
            })
            .catch(error => console.error('Error:', error));
    };
    
    


    const apiUrlDelete = "http://127.0.0.1:8000/delete-items"

    const handleRemoveItem = (id) => {
            fetch(apiUrlDelete, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.access}`
                },
                body: JSON.stringify({ item_id: id }),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Something went wrong ...');
                    }
                })
                .then(data => {
                    setData(data)
                    window.location.reload()
                })
                .catch(error => console.error('Error:', error));
    }

    const apiUrlAccount = "http://127.0.0.1:8000/get-account-details"

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


    const apiUrl = "http://127.0.0.1:8000/get-items"


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
                setData(data)
                setMenu(data.map((item) => (data.length !== 0 ? <OwnMenuCard id={item.id} name={item.name} desc={item.desc} price={item.price} canteen={item.canteen}  ison={item.avilable} addrem={handleAdd} removeItem={handleRemoveItem} disableItem={handleDisableItem} /> : <div></div>)))
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

    const handleAdd = () => {
        const regex = /^[a-zA-Z ]*$/;
        if(newItem.name.length==0)
        {
            alert("Please Enter Valid Name");
            return 
        }
        if (!regex.test(newItem.name)) {
            alert("Name should be less then 100 characters and should not contain any special characters or numbers")
            return
        }
        if (newItem.price <= 0 || newItem.price > 1000) {
            alert("Price should be positive or less than 1000")
            return
        }
        const userConfirm = window.confirm("Are you sure you want to add this item?")
        if (userConfirm) {
            const apiUrl = "http://127.0.0.1:8000/get-items"
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.access}`
                },
                body: JSON.stringify({ ...newItem, "desc": "blah blah blah" })
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Something went wrong ...');
                    }
                })
                .then(data => {
                    window.location.reload()
                })
                .catch(error => console.error('Error:', error));
        }
    }

    const handleNewItemChange = (event) => {
        if (event.target.id === "Name") {
            setNewItem({ ...newItem, "name": event.target.value })
        }
        else if (event.target.id === "Price") {
            setNewItem({ ...newItem, "price": event.target.value })
        }
    }

    const handleAddItem = () => {
        setToggleAdd((toggleAdd) => (!toggleAdd))
    }
    const id = useParams()

    const handleSearch = (event) => {
        setSearchQuery(event.target.value)
        if (event.target.value === '') {
            setMenu(data.map((item) => (data.length !== 0 ? <OwnMenuCard key={item.id} id={item.id} name={item.name} desc={item.desc} price={item.price} canteen={item.canteen} ison={item.available} addrem={handleAdd} removeItem={handleRemoveItem} disableItem={handleDisableItem} /> : <div></div>)))
        }
        else {
            setMenu(data.filter((item) => (item.name.toLowerCase().includes(event.target.value.toLowerCase()))).map((item) => (data.length !== 0 ? <OwnMenuCard key={item.id} id={item.id} name={item.name} desc={item.desc} price={item.price} canteen={item.canteen} ison={item.available} addrem={handleAdd} removeItem={handleRemoveItem} disableItem={handleDisableItem} /> : <div></div>)))
        }
    }

    return (
        <ThemeProvider theme={theme}>
            {isLoaded && gotAccountDetails ? <div style={{ backgroundColor: '#DED8D8', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {/* first box */}
                <div style={{ borderRadius: '108px', marginTop: '70px', backgroundColor: '#EBE7E6', border: '2px solid white', width: '1341px', boxShadow: '0px 10px 5px darkgrey', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '50px' }}>
                    {/* padding box */}
                    <div style={{ width: '1191px' }}>
                        {/* header div / Navigation bar */}
                        <div style={{ display: 'flex', height: '70px', justifyContent: 'center', marginTop: '75px' }}>
                            <img src={logo} alt='website logo' style={{ marginRight: '170px', height: '80px' }} />
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
                        {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '70px' }}>
                            <Typography variant='h2'>{menu[0].canteen}</Typography>
                        </div> */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '60px' }}>
                            <TextField id="search" label="Search" value={searchQuery} onChange={handleSearch} variant="outlined" sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '50px', marginTop: '5px', width: '80%' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <Button variant='contained' sx={{ borderRadius: '30px', marginRight: '20px' }} onClick={handleAddItem}>Add New Items</Button>
                            {/* <Button variant='contained' sx={{ borderRadius: '30px', marginRight: '20px' }}>Save Changes</Button> */}
                        </div>
                        {/* child box of padding box */}
                        {!toggleAdd ? <div></div> : <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', backgroundColor: color ? '#E8CFCF' : '#E9DCDC', borderRadius: '30px', margin: '10px' }} onMouseEnter={() => (setColor(true))} onMouseLeave={() => (setColor(false))}>
                                <TextField id="Name" onChange={handleNewItemChange} value={newItem.name} variant='outlined' label="Name" sx={{ width: '350px', marginLeft: '20px', margin: '10px 30px' }} />
                                <TextField type='number' id="Price" onChange={handleNewItemChange} value={newItem.price} variant='outlined' label="Price" sx={{ fontWeight: 'bold', width: '150px' }} />
                                <Button variant='contained' sx={{ margin: '0px 20px', borderRadius: '30px', height: '40px' }} onClick={handleAdd}>Add</Button>
                            </div>
                        </div>}

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                            {menu}
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
                    </div>
                </footer>
            </div> : <Loading />
            }
            {/* background */}

        </ThemeProvider >
    )
}

export default CownerHome;