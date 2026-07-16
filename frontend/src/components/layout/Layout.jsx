import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-64 bg-white shadow-md flex-shrink-0">
                <Sidebar />
            </div>
            <div className="flex-1 overflow-auto p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout;