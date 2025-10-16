import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Similar to UserContext, this context will be used to share the alert message across the application
const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    // Alert object helps us control the alert
    const [alert, setAlert] = useState({
        message: '',
        severity: 'success',
        open: false
    });

    // useEffect makes sure to close any old alerts if we do a hard reload or when the component first renders
    useEffect(() => {
        setAlert({ ...alert, open: false });
    }, []);

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {children}
        </AlertContext.Provider>
    );
}

export const useAlert = () => useContext(AlertContext);

// Ensures that 'children' are passed
AlertProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
