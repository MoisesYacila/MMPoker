import Navigation from "../components/Navigation";
import Footer from '../components/Footer';
import { Outlet } from "react-router-dom";
import { UserProvider } from '../UserContext';
import { AlertProvider } from '../AlertContext';

export default function RootLayout() {
    // Wrap the entire application in the UserProvider so that all components can access the user context
    // RootLayout renders everything on the website, so we don't need to add the navigation and footer elements on any other children layouts
    return (
        <AlertProvider>
            <UserProvider>
                <Navigation></Navigation>
                <div id="page-content">
                    <Outlet></Outlet>
                    <Footer></Footer>
                </div>
            </UserProvider>
        </AlertProvider>

    )
}