import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function WithNavbar() {
    return(
        <>
        <Navbar />
        <Outlet />
        </>
    );
}

export default WithNavbar;