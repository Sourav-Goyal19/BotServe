import Chatbot from "./chatbot";
import Sidebar from "./components/sidebar";
import { Outlet } from "react-router-dom";

const ProjectLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Chatbot />
      <div className="flex-1 px-5 py-7">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectLayout;
