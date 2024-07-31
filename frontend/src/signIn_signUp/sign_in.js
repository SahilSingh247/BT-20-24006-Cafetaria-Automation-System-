//importing css
import '../App.css';

//importing MUI cmp
import { TextField, Typography, Container } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import Button from '@mui/material/Button';
import { Link } from '@mui/material';
import { Link as LINK} from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//importing photos
import login_photo from './login_photo.jpg'
import cafe from './cafe.png'
import logo from './logo.png'

//importing react cmp
import { NavLink, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

//importing custom cmp
import theme from '../general_compo/theme.js'
import useReSize from './mediaQuery';

import Loading from '../custom_compo/loading.js';
import Checkbox from '@mui/material/Checkbox';

function SignIn() {
  //custom hook for media query
  const [background_style_ext, signIn_style_ext] = useReSize()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState("")
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(0);
  const [canteens, setCanteens] = useState()
  const [gotCanteenDetails, setGotCanteenDetails] = useState(false)
  const handleTypeChange= (event) =>{
    if(event.target.value === "Customer" || event.target.value === "Canteen" || event.target.value==="Supervisor")setType(event.target.value);
    else alert("Invalid Type")
  }

  const apicanteen = 'http://127.0.0.1:8000/get-canteen-Login-details'

  useEffect(() => {
    fetch(apicanteen, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
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
        setCanteens(data)
        setGotCanteenDetails(true)
      })
      .catch(error => console.error('Error:', error));
  }, [])

  const handleChange = (event) => {
    if (event.target.id === "Email") {
      setEmail(event.target.value)
    }
    else if (event.target.id === "Password") {
      setPassword(event.target.value)
    }
  }

  const apiUrl = 'http://127.0.0.1:8000/login';

  //submitting data to backend
  const handleButtonClick = () => {
    console.log(email, password)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])([A-Za-z\d@#$%^&+=!]{8,20})$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (
      !emailRegex.test(email)
    ) {
      alert("Invalid Email")
      return
    }
    if (
      password.length < 8 ||
      password.length > 20 ||
      !passwordRegex.test(password)
    ) {
      alert('Password must be between 8 and 20 characters and contain only alphanumeric characters and one special character.');
      return
    }

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: `${email}`, password: `${password}` }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          alert("You don't have an account/ wrong credentials");
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        // Store the token in local storage or a cookie for later use.
        localStorage.setItem('token', JSON.stringify(data));
        if (type === "Customer" ) setIsSignupSuccessful(1)
        else if(type === "Supervisor") setIsSignupSuccessful(2)
        else if (canteens.filter((item) => (item.canteen_user_email === email))) setIsSignupSuccessful(canteens.filter((item) => (item.canteen_user_email === email))[0].canteen_id + 2)
        else {
            setIsSignupSuccessful(0)
        }
      })
      .catch(error => console.error('Error:', error));
  }

  const [showPassword, setShowPassword] = useState(false);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const handleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {gotCanteenDetails ? (
        <Container className="App" maxWidth="xl" sx={{ backgroundImage: `url(${login_photo})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', ...background_style_ext }}>
          {isSignupSuccessful === 0 && <Navigate to="/" />}
          {isSignupSuccessful === 1 && <Navigate to="/home" />}
          {isSignupSuccessful === 2 && <Navigate to="/S_home" />}
          {isSignupSuccessful !== 1 && isSignupSuccessful !== 0 && isSignupSuccessful!==2 && <Navigate to={`/cownerHome/${isSignupSuccessful}`} />}
          <div className="header" sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <img src={cafe} alt="Left Logo" className="logo-left" align='centre' />
          </div>
          {/* sign-in box */}
          <Container className="signIn" sx={{ background: 'white', borderRadius: '30px', ...signIn_style_ext }}>
          <div className="header">
            <img src={logo} alt="Left Logo" className="logo-left" />
          </div>
            <Typography sx={{ fontWeight: 'bolder', fontSize: '31px',  textEmphasisColor: 'white' }}>Sign In</Typography>
            <TextField
              id="Email"
              label="Email"
              value={email}
              onChange={handleChange}
              variant="outlined"
              sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '30px', marginTop: '35px' }}
              onKeyPress={handleKeyPress}
            />
            <div>
              <TextField
                id="Password"
                label="Password"
                value={password}
                onChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '10px' }}
                onKeyPress={handleKeyPress}
              />
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: "20px" }}>
                <Checkbox {...label} onChange={handleShowPassword} />
                <Typography>Show Password</Typography>
              </div>
              <div style={{ display:"flex", justifyContent:"left", paddingLeft:"35px" }} >
              <Link href="http://127.0.0.1:8000/reset_password" underline="hover" sx={{ fontSize:"17px" }} >{"Forgot Password"}</Link>
            </div>
            </div>
            <div><FormControl sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="demo-simple-select-autowidth-label">Account Type</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={type}
                onChange={handleTypeChange}
                width='100px'
                label="Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Customer" >Customer</MenuItem>
                <MenuItem value="Canteen" >Canteen</MenuItem>
                <MenuItem value="Supervisor" >Supervisor</MenuItem>
              </Select>
            </FormControl></div>
            <Button
              variant="contained"
              onClick={handleButtonClick}
              sx={{ fontWeight: "bolder", width: '220px', height: '50px', fontSize: '20px', textTransform: 'none', marginBottom: '30px', marginTop: '50px' }}
              disableElevation
            >
              Login
            </Button>
            <NavLink to='/sign_up' style={{ textDecoration: 'none', color: 'black' }}>
              <Container sx={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <Typography>Don't have an account?</Typography><Typography color='primary' >Sign up</Typography>
              </Container>
            </NavLink>
          </Container>
        </Container>
      ) : (
        <Loading />
      )}
      {/* background */}
    </ThemeProvider>
  );
}

export default SignIn;