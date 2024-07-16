import { useEffect, useState } from "react";
import { database, ref, onValue } from '../firebaseConfig';
import { Snackbar, Alert } from "@mui/material";
import { Unsubscribe } from "firebase/database";

interface NotificationProps {
    subscribePaths: string[];
    getNotificationMessage: (path: string, data: any) => string;
}

const Notification: React.FC<NotificationProps> = ({ subscribePaths, getNotificationMessage }) => {
    const [notifications, setNotifications] = useState<string[]>([]);

    useEffect(() => {
        const unsubscribeFunctions: Unsubscribe[] = [];
        if (subscribePaths.length > 0) {
            subscribePaths.forEach(path => {
                const dataRef = ref(database, path);

                const unsubscribeData = onValue(dataRef, (snapshot) => {
                    const data = snapshot.val();
                    const message = getNotificationMessage(path, data);
                    if (message) {
                        setNotifications((prev) => [...prev, message]);
                    }
                    console.log('Data from Firebase:', data);
                });

                unsubscribeFunctions.push(unsubscribeData);
            });
        }

        return () => {
            unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
        };
    }, [subscribePaths]);

    const handleClose = (index: number) => (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setNotifications((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            {notifications.map((message, index) => (
                <Snackbar
                    key={index}
                    open={true}
                    autoHideDuration={5000}
                    onClose={handleClose(index)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{ top: `${index * 100}px` }}
                >
                    <Alert onClose={handleClose(index)} severity="info" sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};

export default Notification;
