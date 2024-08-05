import { AppBar, Box, Container, CssBaseline } from "@mui/material"
import NavBar from "./Navbar"

const Layout: React.FC<React.PropsWithChildren<{ pageHeader: JSX.Element, }>> = ({ pageHeader, children }) => {
    return (
        <>
            {pageHeader}
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <NavBar />
                </AppBar>
                <Box sx={{
                    maxWidth: '100vw',
                    margin: '120px auto 0 auto',
                    padding: {
                        xs: '0 10px',
                        sm: '0 10px',
                        md: '0 50px',
                        lg: '0 110px',
                    },
                    }}>
                    {children}
                </Box>
            </Box>
        </>
    )

}

export default Layout;