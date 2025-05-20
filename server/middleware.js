const isLoggedIn = (req, res, next) => {
    // Don't allow operation if user is not authenticated
    if (!req.isAuthenticated()) {
        // We can catch this in the front end to handle the error
        return res.status(401).send('Unauthorized');
    }
    // If user is authenticated, continue to the next middleware or route handler
    next();
}

const isAdmin = (req, res, next) => {
    // Check if the user is authenticated and has admin privileges
    if (!req.isAuthenticated()) {
        // If not authenticated, send a 401 Unauthorized response
        return res.status(401).send('Unauthorized');
    }
    if (!req.user.admin) {
        // If not admin, send a 403 Forbidden response
        return res.status(403).send('Forbidden. Only admins can take this action.');
    }
    // If the user is an admin, continue to the next middleware or route handler
    next();
}

// Export the middleware functions
// Make sure to export as an object and not separately, otherwise module.exports will be the last middleware
// and the first one will be ignored
module.exports = {
    isLoggedIn,
    isAdmin
}