import { useEffect, useState } from "react";

const useOnline = () => {
    const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setOnlineStatus(true);
        const handleOffline = () => setOnlineStatus(false);

        // 1. Listen to both online and offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // 2. Return a cleanup FUNCTION, not a boolean variable
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // 3. Return the state at the bottom of the hook so components can use it
    return onlineStatus;
}

export default useOnline;
