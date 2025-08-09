import Chat from "./components/chat";
import SignIn from "./app/sign-in/page";
import SignUp from "./app/sign-up/page";
import Dashboard from "./app/dashboard/page";
import { Routes, Route } from "react-router-dom";
import ApiKeys from "./app/dashboard/api-keys/page";
import DashboardLayout from "./app/dashboard/layout";

function App() {
  return (
    <div className="bg-background">
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route element={<Dashboard />} />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="api-keys" element={<ApiKeys />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
