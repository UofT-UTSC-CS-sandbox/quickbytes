import { useEffect, useState } from 'react';
import { Box, Drawer, AppBar, CssBaseline, Typography, Toolbar, List, Divider, ListItem, ListItemText, FormGroup, FormControlLabel, Switch } from '@mui/material';
import NavBar from '../components/Navbar';
import settingService from '../services/settingService';
import { getAuth } from 'firebase/auth';
import { NOTIFICATION_LABELS, NotificationType, RoleType } from '../model/NotificationTypes';
import PageHead from '../components/PageHead';

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

    return (
        <Box sx={{ display: 'flex' }}>
            <PageHead title="Settings" description="Manage your account and notification settings" />
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <NavBar />
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', padding: 2 },
                }}
            >
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
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                <CustomTabPanel value={value} index={0}>
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
                <CustomTabPanel value={value} index={1}>
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
                <CustomTabPanel value={value} index={2}>
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Orders
                        </Typography>
                    </div>
                </CustomTabPanel>
            </Box>
        </Box>
    );
}

export default Settings;