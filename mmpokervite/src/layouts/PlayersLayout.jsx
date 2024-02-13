import Navigation from "../components/Navigation";
import Footer from '../components/Footer';
import { Outlet } from "react-router-dom";


export default function PlayersLayout() {
    return (
        <div>
            <Navigation></Navigation>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    )
}