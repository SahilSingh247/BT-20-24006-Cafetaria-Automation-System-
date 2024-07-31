//importing css
import '../App.css';

//importing MUI cmp
import { TextField, Typography, Container } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import Button from '@mui/material/Button';
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
import { useState } from "react";

//importing custom cmp
import theme from '../general_compo/theme.js'
import useReSize from './mediaQuery';

import Checkbox from '@mui/material/Checkbox';

function SignUp() {
  //custom hook for media query 
  const [background_style_ext, signIn_style_ext] = useReSize()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [type, setType] = useState("")
  const [name, setName] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);

  /*const handleChange1 = (event) => {
    setAge(event.target.value);
  };*/
  const handleTypeChange= (event) =>{
    if(event.target.value === "Customer" || event.target.value === "Canteen")setType(event.target.value);
    else if(event.target.value === "Supervisor"){
      if(!(email==="cafesupervisordaiict@gmail.com")){
        alert("You are not a supervisor")
      }
      else setType(event.target.value)
    }
    else alert("Invalid Type")
  }
  const handleChange = (event) => {
    if (event.target.id === "Email") {
      setEmail(event.target.value)
    }
    else if (event.target.id === "Password") {
      setPassword(event.target.value)
    }
    else if (event.target.id === "Confirm Password") {
      setConfirmPassword(event.target.value)
    }
    else if (event.target.id === "Name") {
      setName(event.target.value)
    }
    else if (event.target.id === "ContactNo") {
      setContactNo(event.target.value)
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };

  const apiUrl = 'http://127.0.0.1:8000/register';

  //submitting data to backend
  const handleButtonClick = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{};:'",.<>?/\\|`~])(?=.*\d)[A-Za-z\d!@#$%^&*()-_=+{};:'",.<>?/\\|`~]{8,20}$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const phoneRegex = /^(\+91|0)?[6789]\d{9}$/;
    if (
      !emailRegex.test(email)
    ) {
      alert("Invalid Email")
      return
    }
    if(!(type === "Customer" || type === "Canteen" || type === "Supervisor")){
      alert("Invalid Type")
      return
    }
    if(type === "Supervisor"){
      if(!(email=="cafesupervisordaiict@gmail.com")){
        alert("You are not a supervisor")
        return
      }
    }
    if (
      password.length < 8 ||
      password.length > 20 ||
      !passwordRegex.test(password)
    ) {
      alert('Password must be between 8 and 20 characters and contain only alphanumeric characters and one special character.');
      return
    }
    if (password !== confirmPassword) {
      alert("Passwords don't match")
      return
    }
    if(name.length == 0){
      alert('Enter Valid Name!!')
      return
    }
    if (name.length > 20) {
      alert('Length of name should be less than 20')
      return
    }
    if (!phoneRegex.test(contactNo)) {
      alert('Invalid phone number. Please enter a valid Indian phone number.');
      return
    }
    if(type!=="Canteen")alert("Check Your Email for Verification Link (check the spam folder too)");
    else alert("Wait for the supervisor to verify your account (Check Your Email for confirmation)");
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: `${email}`, password: `${password}`, type: `${type}`, name: `${name}`, contact_number: `${contactNo}` }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          alert("You already have an account");
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        const token = data.token;
        // Store the token in local storage or a cookie for later use.
        localStorage.setItem('token', token);
        setIsSignupSuccessful(true);
      })
      .catch(error => console.error('Error:', error));
  }

  const [showPassword1, setShowPassword1] = useState(false);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const handleShowPassword1 = () => {
    setShowPassword1((showPassword1) => !showPassword1);
  }

  const [showPassword2, setShowPassword2] = useState(false);
  
  const handleShowPassword2 = () => {
    setShowPassword2((showPassword2) => !showPassword2);
  }

  

  return (
    <ThemeProvider theme={theme}>
      {/* background */}
      <Container className="App" maxWidth='xl' sx={{ backgroundImage: `url(${login_photo})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', ...background_style_ext }}>
        {isSignupSuccessful && <Navigate to="/" />}
        <div className="header">
            <img src={cafe} alt="Left Logo" className="logo-left" align='centre' />
        </div>
        {/* sign-up box */}
        <Container className='signIn' width='900px' sx={{ background: 'white', borderRadius: '30px', ...signIn_style_ext }}>
        <div className="header">
            <img src={logo} alt="Left Logo" className="logo-left" />
        </div>
          <Typography sx={{ fontWeight: 'bolder', fontSize: '31px' }}>Sign Up</Typography>
          <TextField id="Email" label="Email" value={email} onKeyPress={handleKeyPress} onChange={handleChange} variant="outlined" sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '30px', marginTop: '23px' }} />
          <TextField id="Name" label="Name" value={name} onKeyPress={handleKeyPress} onChange={handleChange} variant="outlined" sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '30px' }} />
          <div><FormControl sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="demo-simple-select-autowidth-label">Account Type</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={type}
                onChange={handleTypeChange}
                autoWidth
                label="Account Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Customer" >Customer</MenuItem>
                <MenuItem value="Canteen" >Canteen</MenuItem>
                <MenuItem value="Supervisor" >Supervisor</MenuItem>
              </Select>
            </FormControl></div>
          <TextField id="ContactNo" label="ContactNo" value={contactNo} onKeyPress={handleKeyPress} onChange={handleChange} variant="outlined" sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '30px' }} />
          <div style={{ marginBottom: "10px" }}>
          <div>
          </div>
            <TextField id="Password" label="New Password" value={password} onKeyPress={handleKeyPress} onChange={handleChange} type={showPassword1 ? 'text' : 'password'} variant="outlined" sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '10px' }} />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: "20px" }}>
              <Checkbox {...label} onChange={handleShowPassword1} />
              <Typography>Show Password</Typography>
            </div>
          </div>
          <div>
            <TextField id="Confirm Password" label="Confirm Password" value={confirmPassword} onKeyPress={handleKeyPress} onChange={handleChange} type={showPassword2 ? 'text' : 'password'} variant="outlined" sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '10px' }} />
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: "20px" }}>
              <Checkbox {...label} onChange={handleShowPassword2} />
              <Typography>Show Password</Typography>
            </div>
          </div><Button variant="contained" onClick={handleButtonClick} sx={{ fontWeight: "bolder", width: '220px', height: '50px', fontSize: '20px', textTransform: 'none', marginBottom: '20px' }} disableElevation>Sign Up</Button>
          <NavLink to='/' style={{ textDecoration: 'none', color: 'black' }}>
            <Container sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Typography>Already have an account?</Typography><Typography color='primary'> Sign in</Typography>
            </Container>
          </NavLink>
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;