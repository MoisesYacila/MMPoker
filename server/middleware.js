const isLoggedIn = (req, res, next) => {
    // Don't allow operation if user is not authenticated
    if (!req.isAuthenticated()) {
        // We can catch this in the front end to handle the error
        return res.status(401).send('Unauthorized');
    }
    // If user is authenticated, continue to the next middleware or route handler
    next();
}

// Export the middleware function
module.exports = isLoggedIn;