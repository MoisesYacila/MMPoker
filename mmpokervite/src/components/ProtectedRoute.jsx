import { Navigate } from "react-router-dom";
import { useUser } from "../UserContext.jsx";
import PropTypes from 'prop-types';
import { CircularProgress } from "@mui/material";

export default function ProtectedRoute({ requireAdmin = false, children }) {

    const { loggedIn, isAdmin, loading } = useUser();
    if (loading) {
        // If the loading state is true, we can return a loading spinner
        return <CircularProgress />;
    }

    if (!loggedIn) {
        return <Navigate to="/login" state={{ message: 'You must be logged in to access this page.', openAlertLink: true }} />;
    }

    else if (requireAdmin && !isAdmin) {
        return <Navigate to="/unauthorized" state={{ message: 'You must be an admin to access this page.', openAlertLink: true }} />;
    }

    // If the user is logged in and is an admin (if required), render the children components that are wrapped by this ProtectedRoute
    return children;
}

// Ensures that 'requireAdmin' is optional and 'children' are passed
ProtectedRoute.propTypes = {
    requireAdmin: PropTypes.bool,
    children: PropTypes.node.isRequired
};