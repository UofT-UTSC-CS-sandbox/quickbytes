import { useEffect, useState } from 'react';
import { Box, Drawer, Typography, Toolbar, List, Divider, ListItem, ListItemText, FormGroup, FormControlLabel, Switch, Button } from '@mui/material';
import settingService from '../services/settingService';
import { getAuth } from 'firebase/auth';
import { NOTIFICATION_LABELS, NotificationType, RoleType } from '../model/NotificationTypes';
import PageHead from '../components/PageHead';
import { SettingsOutlined } from '@mui/icons-material';
import Layout from '../components/Layout';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    onIconButtonClick: () => void;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, onIconButtonClick, ...other } = props;
    const styleOnlyShowOnMobile = { display: { xs: 'inline-block', sm: 'none' } };
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Button startIcon={<SettingsOutlined />} onClick={onIconButtonClick} sx={{ ... styleOnlyShowOnMobile, width: '100%'}}>
                Settings
            </Button>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const drawerWidth = 240;

function Settings() {
    const [value, setValue] = useState(0);
    const [notificationsEnabled, setNotificationsEnabled] = useState<NotificationType[]>([]);
    const [rolesEnabled, setRolesEnabled] = useState<RoleType[]>([]);
    const userName = getAuth().currentUser?.email?.split("@")[0];

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { mutate: updateNotification } = settingService.updateNotification(() => console.log("Successfully updated notification")).useMutation();
    const { mutate: updateRole } = settingService.updateRole(() => console.log("Successfully updated role")).useMutation();
    const { data: data } = settingService.getNotificationSettings().useQuery();
    const { data: roleData } = settingService.getRoleSettings().useQuery();

    useEffect(() => {
        if (data) {
            setNotificationsEnabled(Object.values(NotificationType).filter((type) => data.notification_settings[type] === true));
        }
    }, [data]);

    useEffect(() => {
        if (roleData) {
            setRolesEnabled(Object.values(RoleType).filter((role) => roleData.role_settings[role] === true));
        }
    }, [roleData]);

    const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>, type: NotificationType) => {
        const enabled = event.target.checked;
        const existingNotifs = notificationsEnabled.filter((notification: NotificationType) => notification !== type);
        if (enabled) {
            setNotificationsEnabled([...existingNotifs, type]);
        } else {
            setNotificationsEnabled(existingNotifs);
        }
        updateNotification({ role: type, enabled });
    }

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>, role: RoleType) => {
        const enabled = event.target.checked;
        const existingRoles = rolesEnabled.filter((existing: RoleType) => existing !== role);
        if (enabled) {
            setRolesEnabled([...existingRoles, role]);
        } else {
            setRolesEnabled(existingRoles);
        }
        updateRole({ role, enabled });
    }

    // Mobile drawer functionality
    const styleOnlyShowOnDesktop = { display: { xs: 'none', sm: 'block' } };
    const styleOnlyShowOnMobile = { display: { xs: 'block', sm: 'none' } };
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    // Close the drawer on mobile when changing tabs
    useEffect(() => {
        if (mobileOpen) {
            setMobileOpen(false);
        }
    }, [value])
    
    const drawerContent = <>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
            <List>
                <ListItem button key={0} selected={value === 0} onClick={(event) => handleChange(event, 0)}>
                    <ListItemText primary="Profile" />
                </ListItem>
                <ListItem button key={1} selected={value === 1} onClick={(event) => handleChange(event, 1)}>
                    <ListItemText primary="Notification Settings" />
                </ListItem>
                <ListItem button key={2} selected={value === 2} onClick={(event) => handleChange(event, 2)}>
                    <ListItemText primary="Orders" />
                </ListItem>
            </List>
            <Divider />
        </Box>
    </>

    return (
        <Layout pageHeader={<PageHead title="Settings" description="Manage your account and notification settings" />}>           
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', padding: 2 },
                    ...styleOnlyShowOnDesktop,
                }}
            >
                <Toolbar/>
                {drawerContent}
            </Drawer>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    zIndex: (theme) => theme.zIndex.drawer + 2,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', padding: 2 },
                    ...styleOnlyShowOnMobile,
                }}
            >
                {drawerContent}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <CustomTabPanel value={value} index={0} onIconButtonClick={handleDrawerToggle}>
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Profile
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'rgba(0, 114, 147, 1)' }} gutterBottom>
                            {userName}
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={rolesEnabled.includes(RoleType.CUSTOMER_ROLE)} onChange={(e) => handleRoleChange(e, RoleType.CUSTOMER_ROLE)} />}
                                label="Toggle for customer role"
                            />
                            <FormControlLabel
                                control={<Switch checked={rolesEnabled.includes(RoleType.COURIER_ROLE)} onChange={(e) => handleRoleChange(e, RoleType.COURIER_ROLE)} />}
                                label="Toggle for courier role"
                            />
                        </FormGroup>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1} onIconButtonClick={handleDrawerToggle}>
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Notifications
                        </Typography>
                        <FormGroup>
                            {
                                Object.values(NotificationType).map((type) => (
                                    <FormControlLabel
                                        key={type}
                                        control={<Switch checked={notificationsEnabled.includes(type)} onChange={(e) => handleNotificationChange(e, type)} />}
                                        label={NOTIFICATION_LABELS[type]}
                                    />
                                ))
                            }
                        </FormGroup>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2} onIconButtonClick={handleDrawerToggle}>
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Orders
                        </Typography>
                    </div>
                </CustomTabPanel>
            </Box>
            </Layout>
    );
}

export default Settings;