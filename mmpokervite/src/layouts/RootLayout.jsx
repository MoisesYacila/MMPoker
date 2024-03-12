import Navigation from "../components/Navigation";
import Footer from '../components/Footer';
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    return (
        <>
            {/* RootLayout renders everything on the website, so we don't need to add the navigation
            and footer elements on any other children layouts */}
            <Navigation></Navigation>
            <div id="page-content">
                <Outlet></Outlet>
                <Footer></Footer>
            </div>

        </>


    )
}