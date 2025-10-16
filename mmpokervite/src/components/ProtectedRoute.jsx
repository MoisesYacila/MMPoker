import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../UserContext.jsx";
import { useAlert } from "../AlertContext.jsx";
import PropTypes from 'prop-types';
import { CircularProgress } from "@mui/material";

export default function ProtectedRoute({ requireAdmin = false, children }) {

    const [redirect, setRedirect] = useState(false);
    const { alert, setAlert } = useAlert();
    const { loggedIn, isAdmin, loading } = useUser();
    const [firstRender, setFirstRender] = useState(true);


    // useEffect to update alert after render
    // loggedIn might get updated after the first render so we need to listen for changes
    useEffect(() => {
        // Skip the first render to avoid showing the alert when the component mounts
        if (firstRender) {
            setFirstRender(false);
            return;
        }

        // If the user is not logged in, set the alert and redirect
        if (!loggedIn) {
            setAlert({ message: 'You must be logged in to access this page.', severity: 'error', open: true });
            setRedirect(true);

        }

        // Otherwise, close the alert
        else {
            setAlert({ ...alert, open: false });
        }
    }, [loggedIn, redirect]);

    if (loading) {
        // If the loading state is true, we can return a loading spinner
        return <CircularProgress />;
    }

    // Only when both signals (not logged in and clear to redirect) are true we redirect
    if (!loggedIn && redirect) {
        return <Navigate to="/login" />;
    }

    else if (loggedIn && requireAdmin && !isAdmin) {
        return <Navigate to="/unauthorized" />;
    }

    // If loggedIn is false, and redirect is also false, it means that the alert hasn't been set yet, so we update redirect, which triggers the useEffect that does the rest
    else if (!loggedIn) {
        setRedirect(true);
    }

    // If the user is logged in and is an admin (if required), render the children components that are wrapped by this ProtectedRoute
    return children;
}

// Ensures that 'requireAdmin' is optional and 'children' are passed
ProtectedRoute.propTypes = {
    requireAdmin: PropTypes.bool,
    children: PropTypes.node.isRequired
};