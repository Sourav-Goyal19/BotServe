import Sidebar from "./components/sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 px-5 py-7">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
