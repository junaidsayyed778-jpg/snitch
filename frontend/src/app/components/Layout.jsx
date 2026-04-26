import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-[#131313]" style={{ color: "#e5e2e1" }}>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
