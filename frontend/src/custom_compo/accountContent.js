//importing MUI cmp
import { ThemeProvider } from "styled-components";
import { green } from '@mui/material/colors';
import { Button, Typography, createTheme } from '@mui/material/';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';

function AccountContent(props) {
    const theme = createTheme({
        palette: {
            primary: { main: "#e57417" },
            secondary: green
        }
    })
    return (
        <ThemeProvider theme={theme}>
            {/* background */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', width: '460px' }}>
                    <Button variant='contained' sx={{ borderRadius: '30px' }} onClick={() => { props.drawerButton(props.anchor, false) }}><WestIcon /></Button>
                    <Typography variant='h5' sx={{ paddingLeft: '120px', fontWeight: 'bold' }}>Account</Typography>
                </div>
                {/* box to show items that customer wants to purchase */}
                <div style={{ border: '2px solid white', borderRadius: '30px', width: '415px', margin: '5px', marginTop: '90px', padding: '20px' }}>
                    <Typography variant="h3" sx={{ padding: '30px 0px', fontWeight: 'bold'}}>{props.accountDetails.name}</Typography>
                    {/* <Typography variant="h6">Email</Typography>
                    <Typography variant="h5" sx={{paddingBottom:'20px'}}>abc@gmail.com</Typography> */}
                    <Typography variant="h6" sx={{fontWeight: 'bold', fontWeight: 'bold' }}>Phone Number</Typography>
                    <Typography variant="h5" sx={{ paddingBottom: '20px' }}>{props.accountDetails.contact_number}</Typography>
                    <Typography variant="h6" sx={{fontWeight: 'bold' }}>{props.accountDetails.total_orders ? "Total Orders" : ""}</Typography>
                    <Typography variant="h5">{props.accountDetails.total_orders ? props.accountDetails.total_orders : ''}</Typography>
                </div>
                {/* box to show the final summary of the items  */}
                <div style={{width: '415px', marign: '5px', padding: '20px', marginTop: '80px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Button variant='contained' sx={{ borderRadius: '30px', margin: '40px 0px 5px 0px', width: '350px', padding: '10px' }} endIcon={<EastIcon />} onClick={() => (props.signOut())}>Sign Out</Button>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default AccountContent;