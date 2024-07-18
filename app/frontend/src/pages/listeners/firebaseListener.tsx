import { ref, onValue } from 'firebase/database';
import { useEffect } from 'react';

// Define the type for the callback function
type CallbackType = (data: any) => void;

// Subject
const useFirebaseListener = (database: any, path: string, callback: CallbackType) => {
    useEffect(() => {
        const dataRef = ref(database, path);

        const unsubscribeData = onValue(dataRef, (snapshot) => {
            const data = snapshot.val();
            // Notify observers
            callback(data);
        });

        return () => unsubscribeData();
    }, [database, path, callback]);
};

export default useFirebaseListener;
