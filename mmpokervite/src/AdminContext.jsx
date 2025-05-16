import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Similar to UserContext, this context will be used to let the application know if the user is an admin or not
const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    return (
        <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
            {children}
        </AdminContext.Provider>
    );
}

export const useAdmin = () => useContext(AdminContext);

AdminProvider.propTypes = {
    children: PropTypes.node.isRequired
}