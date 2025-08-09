import Logo from "@/components/logo";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    {
      name: "Overview",
      to: "/dashboard",
    },
    {
      name: "Quick Start",
      to: "/dashboard/start",
    },
    {
      name: "API Keys",
      to: "/dashboard/api-keys",
    },
  ];

  return (
    <aside className="hidden lg:block w-[280px] border-r border-border bg-fuchsia-100/10 p-4 overflow-y-auto h-screen">
      <Logo />
      <div className="flex flex-col mt-5 gap-3">
        {links.map((li, idx) => (
          <Link
            to={li.to}
            key={idx}
            className={cn(
              "text-[17px] text-center w-full block p-1 hover:bg-violet-700/20 hover:text-violet-700 transition rounded-sm",
              location.pathname == li.to
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground cursor-default"
                : "bg-transparent text-foreground"
            )}
          >
            {li.name}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
