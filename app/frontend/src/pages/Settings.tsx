import { useEffect, useState } from 'react';
import { Box, Drawer, AppBar, CssBaseline, Toolbar, List, Divider, ListItem, ListItemText, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import NavBar from '../components/Navbar';
import settingService from '../services/settingService';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const drawerWidth = 240;

function Settings() {
    const [userID, setUserId] = useState('');
    const [value, setValue] = useState(0);
    const [customerNotificationsEnabled, setCustomerNotificationsEnabled] = useState(false);
    const [courierNotificationsEnabled, setCourierNotificationsEnabled] = useState(false);
    const [customerRoleEnabled, setCustomerRoleEnabled] = useState(false);
    const [courierRoleEnabled, setCourierRoleEnabled] = useState(false);

    useEffect(() => {
        const auth = getAuth();

        // get current user uid from firebase
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                console.log('No user is signed in.');
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { mutate: updateNotification } = settingService.updateNotification(userID, () => console.log("Successfully updated notification")).useMutation();
    const { mutate: updateRole } = settingService.updateRole(userID, () => console.log("Successfully updated role")).useMutation();
    const { data: data } = settingService.getNotificationSettings(userID).useQuery();
    const { data: roleData } = settingService.getRoleSettings(userID).useQuery();

    useEffect(() => {
        if (data) {
            setCustomerNotificationsEnabled(data.notification_settings.customerNotifications);
            setCourierNotificationsEnabled(data.notification_settings.courierNotifications);
        }
    }, [data]);

    useEffect(() => {
        if (roleData) {
            setCustomerRoleEnabled(roleData.role_settings.customerRole);
            setCourierRoleEnabled(roleData.role_settings.courierRole);
        }
    }, [roleData]);

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>, role: string, type: string) => {
        const enabled = event.target.checked;

        if (type === 'notification') {
            if (role === 'customerNotifications') {
                setCustomerNotificationsEnabled(enabled);
            } else {
                setCourierNotificationsEnabled(enabled);
            }
            updateNotification({ role, enabled });
        } else {
            if (role === 'customerRole') {
                setCustomerRoleEnabled(enabled);
            } else {
                setCourierRoleEnabled(enabled);
            }
            updateRole({ role, enabled });
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <NavBar />
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        <ListItem button key={0} onClick={(event) => handleChange(event, 0)}>
                            <ListItemText primary="Profile" />
                        </ListItem>
                        <ListItem button key={1} onClick={(event) => handleChange(event, 1)}>
                            <ListItemText primary="Notification Settings" />
                        </ListItem>
                        <ListItem button key={2} onClick={(event) => handleChange(event, 2)}>
                            <ListItemText primary="Orders" />
                        </ListItem>
                    </List>
                    <Divider />
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <CustomTabPanel value={value} index={0}>
                    <div>
                        Profile
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={customerRoleEnabled} onChange={(e) => handleSwitchChange(e, 'customerRole', 'role')} />}
                                label="Toggle for customer role"
                            />
                            <FormControlLabel
                                control={<Switch checked={courierRoleEnabled} onChange={(e) => handleSwitchChange(e, 'courierRole', 'role')} />}
                                label="Toggle for courier role"
                            />
                        </FormGroup>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <div>
                        Notifications
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={customerNotificationsEnabled} onChange={(e) => handleSwitchChange(e, 'customerNotifications', 'notification')} />}
                                label="Toggle on for customer notifications"
                            />
                            <FormControlLabel
                                control={<Switch checked={courierNotificationsEnabled} onChange={(e) => handleSwitchChange(e, 'courierNotifications', 'notification')} />}
                                label="Toggle on for courier notifications"
                            />
                        </FormGroup>
                    </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <div>
                        Orders
                    </div>
                </CustomTabPanel>
            </Box>
        </Box>
    );
}

export default Settings;
