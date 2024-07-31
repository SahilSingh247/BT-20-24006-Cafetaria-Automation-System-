//importing MUI cmp
import { Typography } from '@mui/material/';

//importing react cmp
import { useState } from 'react';

function Specialities(props) {
    const [isShown,setIsshown] = useState(false)

    return (
        <div id={props.id} style={{ backgroundColor: isShown ? '#E9DCDC' : '#EBE7E6', width: '266px', padding: '40px', margin: '20px', borderRadius: '15px' }} onMouseEnter={() => (setIsshown(true))} onMouseLeave={() => (setIsshown(false))}>
            <img src={props.image} alt='location' style={{ width: '82px', marginBottom: '15px' }} />
            <Typography variant='h4' style={{ marginBottom: '30px' }}>{props.title}</Typography>
            <Typography>{props.description}</Typography>
        </div>
    )
}

export default Specialities;