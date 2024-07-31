//importing MUI media query
import useMediaQuery from '@mui/material/useMediaQuery';

//custom hook
function useReSize() {
    const background_style_ext = { m: 0, py: 13.7 }
    const signIn_style_ext = { width: "337px", p: 0.1, ml: 13, mt: 4, mb: 10, mr: 'auto' }
    const screen_height_1 = useMediaQuery('(max-height:1000px)')
    const screen_height_2 = useMediaQuery('(max-height:1200px)')
    const screen_height_3 = useMediaQuery('(max-height:1400px)')
    const screen_height_4 = useMediaQuery('(height:803px)')
    const screen_width_1 = useMediaQuery('(min-width:1000px)')
    const screen_width_2 = useMediaQuery('(min-width:1500px)')


    if (screen_height_1) {
        signIn_style_ext.width = "280px"
        signIn_style_ext.ml = 'auto'
        signIn_style_ext.mt = 0
        signIn_style_ext.mb = 0
        signIn_style_ext.mr = 'auto'
        background_style_ext.py = 27.7
    }

    else if (screen_height_2) {
        signIn_style_ext.width = "337px"
        signIn_style_ext.ml = 5.4
        signIn_style_ext.mt = 0
        signIn_style_ext.mb = 0
        signIn_style_ext.mr = 0
        background_style_ext.py = 44.2
    }

    else if (screen_height_3) {
        signIn_style_ext.width = "337px"
        signIn_style_ext.ml = 13
        signIn_style_ext.mt = 0
        signIn_style_ext.mb = 0
        signIn_style_ext.mr = 'auto'
        background_style_ext.py = 56
    }

    if (screen_width_2) {
        signIn_style_ext.width = "337px"
        signIn_style_ext.ml = 13
        signIn_style_ext.mt = 'auto'
        signIn_style_ext.mb = 'auto'
        signIn_style_ext.mr = 'auto'
        if (!screen_height_4) background_style_ext.py = 30.5
        else background_style_ext.py = 20.7
    }
    else if (screen_width_1) {
        signIn_style_ext.width = "337px"
        signIn_style_ext.ml = 5
        signIn_style_ext.mt = 'auto'
        signIn_style_ext.mb = 'auto'
        signIn_style_ext.mr = 'auto'
        background_style_ext.py = 27.7
    }
    return [background_style_ext, signIn_style_ext]
}

export default useReSize;