import { createContext, useContext, useState } from 'react';

// Similar to UserContext, this context will be used to share the alert message across the application
const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alertMessage, setAlertMessage] = useState('');

    return (
        <AlertContext.Provider value={{ alertMessage, setAlertMessage }}>
            {children}
        </AlertContext.Provider>
    );
}

export const useAlert = () => useContext(AlertContext);