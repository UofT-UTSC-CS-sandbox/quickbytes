import { Box, Button, Drawer, Paper, Typography } from "@mui/material";
import { PropsWithChildren, useState } from "react";
import { MenuCategory } from "../model/Menu";
import { Menu } from "@mui/icons-material";

interface MenuCategoryDrawerProps extends PropsWithChildren {
    children: React.ReactNode
    category: MenuCategory | null
    categories: MenuCategory[]
}

const MenuCategoryDrawer = ({ children, category }: MenuCategoryDrawerProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    return (
        <Box component="nav"
        sx={{ width: { sm: 200 }, flexShrink: { sm: 0 } }}>
            {/* Button to toggle mobile menu */}
            <Button
                color="primary"
                aria-label="open drawer"
                variant='contained'
                onClick={handleDrawerToggle}
                sx={{ display: { sm: 'none' }, position: { sm: 'absolute'}, textTransform: 'none' }}
                size='large'
                startIcon={<Menu />}
            >
                <Typography>{category?.name || 'Categories'}</Typography>
            </Button>
            {/* The mobile menu */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onTransitionEnd={handleDrawerTransitionEnd}
                onClose={handleDrawerClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 200 },
                }}
            >
                {children}
            </Drawer>
            {/* The menu for desktop / larger screens */}
            <Paper
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 200 },
                }}
            >
                {children}
            </Paper>
        </Box>
    )
}

export default MenuCategoryDrawer;