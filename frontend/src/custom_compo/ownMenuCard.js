//importing css
import '../App.css';

//importing MUI cmp
import { Typography, TextField } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import Button from '@mui/material/Button';

//importing react cmp
import { useState } from 'react';

//importing custom cmp
import theme from "../general_compo/theme.js";

function OwnMenuCard(props) {
    const [color, setColor] = useState(false);
    const [isDisabled, setIsDisabled] = useState(props.ison); // Initialize with props.ison
    const [toggleEdit, setToggleEdit] = useState(false);
    const [newItem, setNewItem] = useState({ "name": "", "price": 0 });

    const token = JSON.parse(localStorage.getItem('token'))
    const handleToggleDisable = () => {
        props.disableItem(props.id);
        setIsDisabled(!isDisabled); // Toggle the disabled state
    };
    const handleEditItem = () => {
        setToggleEdit((toggleEdit) => (!toggleEdit))
    }
    const handleNewItemChange = (event) => {
        if (event.target.id === "Name") {
            setNewItem({ ...newItem, "name": event.target.value })
        }
        else if (event.target.id === "Price") {
            setNewItem({ ...newItem, "price": event.target.value })
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
        const userConfirm = window.confirm("Are you sure you want to Edit this item?")
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
    const handleAddrem = () => {
        handleAdd()
        setToggleEdit((toggleEdit) => (!toggleEdit))
        props.removeItem(props.id);
    }
    return (
        //displaying menu item
        <ThemeProvider theme={theme}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    backgroundColor: color ? '#E8CFCF' : '#E9DCDC',
                    borderRadius: '30px',
                    margin: '10px'
                }}
                onMouseEnter={() => setColor(true)}
                onMouseLeave={() => setColor(false)}
            >
                <Typography variant='h6' sx={{ width: '550px', marginLeft: '20px' }}>
                    {props.name}
                </Typography>
                <Typography variant='h6' sx={{ fontWeight: 'bold', width: '250px' }}>
                    {props.price}
                </Typography>
                {/* <Button id={props.id} variant='contained' sx={{margin:'0px 20px',borderRadius:'30px',height:'30px'}}>Edit Item</Button> */}
                
                {toggleEdit ? <div></div> : <div>
                <Button
                    id={props.id}
                    variant='contained'
                    sx={{ margin: '0px 20px', borderRadius: '30px', height: '30px' }}
                    onClick={handleEditItem}
                >
                    {toggleEdit ? 'Cancel' : 'Edit'}
                </Button></div>}
                {!toggleEdit ? <div></div> : <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' ,width:'50px'}}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', backgroundColor: color ? '#E8CFCF' : '#E9DCDC', borderRadius: '30px', margin: '10px',width: '350px' }} onMouseEnter={() => (setColor(true))} onMouseLeave={() => (setColor(false))}>
                                <TextField id="Name" onChange={handleNewItemChange} value={newItem.name} variant='outlined' label="Name" sx={{ width: '150px', marginLeft: '20px', margin: '10px 30px' }} />
                                <TextField type='number' id="Price" onChange={handleNewItemChange} value={newItem.price} variant='outlined' label="Price" sx={{ fontWeight: 'bold', width: '100px' }} />
                                <Button variant='contained' sx={{ margin: '0px 20px', borderRadius: '30px', height: '40px' }} onClick= {handleAddrem} >Save</Button>
                            </div>
                 </div>}
                {toggleEdit ? <div></div> : <div><Button
                    id={props.id}
                    variant='contained'
                    sx={{ margin: '0px 20px', borderRadius: '30px', height: '30px' }}
                    onClick={handleToggleDisable}
                >
                    {isDisabled ? 'Enable' : 'Disable'}
                </Button>
                </div>}
                {toggleEdit ? <div></div> : <div>
                <Button
                    id={props.id}
                    variant='contained'
                    sx={{ margin: '0px 20px', borderRadius: '30px', height: '30px' }}
                    onClick={() => props.removeItem(props.id)}
                >
                    Remove
                </Button></div>}
            </div>
        </ThemeProvider>
    );
}

export default OwnMenuCard;
