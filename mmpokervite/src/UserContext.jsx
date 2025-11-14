import api from './api/axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { log, errorLog } from './utils/logger.js';

// Context allows us to share state across the website in a cleaner way
// In this case, our navbar needs to know if the user is logged in or not, so we can use this context to share that information

// Create a context for user authentication
const UserContext = createContext();

// Create and export the provider component
// This component will wrap the entire application and provide the user context to all components (children)
export const UserProvider = ({ children }) => {
    // This state will be accessible to all components that use the UserContext, in this case, the Navigation component
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    // Setting a loading state to true initially, so we can show a loading spinner while we check the user's login status
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(null);
    const [username, setUsername] = useState('');
    const [userFullName, setUserFullName] = useState('');
    const navigate = useNavigate();

    // Handler for session expiration
    // This will reset the user context and redirect to the login page
    const handleSessionExpired = () => {
        log('Session expired, resetting user context...');
        setLoggedIn(false);
        setIsAdmin(false);
        setId(null);
        setUserFullName('');
        setUsername('');
        navigate('/login');
    };

    // Handler for server down event
    // This will reset the user context and redirect to the server down page
    const handleServerDown = () => {
        setLoggedIn(false);
        setIsAdmin(false);
        setId(null);
        setUserFullName('');
        setUsername('');
        navigate('/serverdown');
    };

    // Every time the app loads, we want to check the user's login and admin status
    // This will be triggered by hard reloads or when we first load the app
    // The navbar will use this information to show the correct button (Log In or Log Out)
    useEffect(() => {
        // Check every time if the user is an admin and logged in, otherwise, on hard reloads, admin and login status will be lost
        api.get('/isAdmin')
            .then((res) => {
                setIsAdmin(res.data.isAdmin);
                setLoggedIn(res.data.isLoggedIn);
                setLoading(false);
                setId(res.data.id);
                setUserFullName(res.data.userFullName || '');
                setUsername(res.data.username || '');
            })
            .catch((error) => {
                errorLog('Error checking admin status:', error);
                setIsAdmin(false);
            });

    }, []);

    // Set up event listeners for session expiration and server down events
    // We are triggering these events from api/axios.js when we get a 401 or 503 response from the server
    useEffect(() => {
        window.addEventListener('sessionExpired', handleSessionExpired);
        window.addEventListener('serverDown', handleServerDown);

        // Clean up the event listeners when the component unmounts
        // This is important to avoid memory leaks
        // The return statement won't run until the component unmounts, so rarely in this case because this component is wrapping the entire app
        return () => {
            window.removeEventListener('sessionExpired', handleSessionExpired);
            window.removeEventListener('serverDown', handleServerDown);
        };
    }, []);

    return (
        // Provide the loggedIn state and setLoggedIn function to all components that use this context
        // This is how useUser knows what to use
        <UserContext.Provider value={{ loggedIn, setLoggedIn, isAdmin, setIsAdmin, loading, id, setId, userFullName, setUserFullName, username, setUsername }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext in other components
export const useUser = () => useContext(UserContext);

// Ensures that 'children' are passed
UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
