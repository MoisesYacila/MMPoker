import axios from 'axios';
import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';

// Context allows us to share state across the website in a cleaner way
// In this case, our navbar needs to know if the user is logged in or not, so we can use this context to share that information

// Create a context for user authentication
const UserContext = createContext();

// Create and export the provider component
// This component will wrap the entire application and provide the user context to all components (children)
export const UserProvider = ({ children }) => {
    // This state will be accessible to all components that use the UserContext, in this case, the Navigation component
    const [loggedIn, setLoggedIn] = useState(false);

    // Every time the app loads, we want to check if the user is logged in or not
    // This will be triggered by hard reloads or when we first load the app
    // The navbar will use this information to show the correct button (Log In or Log Out)
    useEffect(() => {
        axios.get('http://localhost:8080/loggedin', { withCredentials: true })
            .then((res) => {
                // The server will return a boolean value, so we can use that to set the loggedIn state
                setLoggedIn(res.data);
            })
            .catch((error) => {
                console.error('Error checking login status:', error);
                setLoggedIn(false);
            });
    }, []);

    return (
        // Provide the loggedIn state and setLoggedIn function to all components that use this context
        // This is how useUser knows what to use
        <UserContext.Provider value={{ loggedIn, setLoggedIn }}>
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
