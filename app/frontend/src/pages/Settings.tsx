import { useEffect, useState } from 'react';
import { Box, Drawer, AppBar, CssBaseline, Toolbar, List, Divider, ListItem, ListItemText, FormGroup, FormControlLabel, Switch } from '@mui/material';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import NavBar from '../components/Navbar';
import settingService from '../services/settingService';
import { NOTIFICATION_LABELS, NotificationType, RoleType } from '../model/NotificationTypes';

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
    const [notificationsEnabled, setNotificationsEnabled] = useState<NotificationType[]>([]);
    const [rolesEnabled, setRolesEnabled] = useState<RoleType[]>([]);

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
                <CustomTabPanel value={value} index={1}>
                    <div>
                        Notifications
                        <FormGroup>
                            {
                                Object.values(NotificationType).map((type) => (
                                    <FormControlLabel
                                        control={<Switch checked={notificationsEnabled.includes(type)} onChange={(e) => handleNotificationChange(e, type)} />}
                                        label={NOTIFICATION_LABELS[type]}
                                    />
                                ))
                            }
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
