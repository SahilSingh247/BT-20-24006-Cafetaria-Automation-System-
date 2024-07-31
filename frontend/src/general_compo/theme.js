//importing MUI cmp
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material';

//defining theme
const theme = createTheme({
    palette: {
        primary: { main: "#e57417" },
        secondary: green
    }
})

export default theme;