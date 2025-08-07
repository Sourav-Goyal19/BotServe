import { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  let data = localStorage.getItem("threads");
  data = data ? JSON.parse(data) : [];
  const navigate = useNavigate();
  // console.log(data);
  //@ts-ignore
  const [history] = useState(Array.from(data));
  return (
    <aside className="hidden lg:block w-[280px] border-r border-border/50 bg-card/20 p-4 overflow-y-auto">
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground/80">New</h4>
          <div className="space-y-1">
            <Button
              variant="outline"
              onClick={() => {
                navigate("/");
              }}
              className="w-full"
            >
              New Chat
            </Button>
          </div>
        </div>
        <div className="space-y-3 flex-1 flex-col overflow-y-auto">
          <h4 className="font-semibold text-foreground/80">Recent Chats</h4>
          {history ? (
            history.map((item, idx) => (
              <Button
                variant="outline"
                onClick={() => {
                  navigate(`/chat/${item}`);
                }}
                className="truncate w-full"
                key={idx}
              >
                {item.toString().slice(0, 28)}...
              </Button>
            ))
          ) : (
            <p>No Recent Chats</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
