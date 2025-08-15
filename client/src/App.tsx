import Chat from "./components/chat";
import SignIn from "./app/sign-in/page";
import SignUp from "./app/sign-up/page";
import Project from "./app/projects/[projectId]/page";
import ProjectsPage from "./app/projects/page";
import { Routes, Route } from "react-router-dom";
import ApiKeys from "./app/projects/[projectId]/api-keys/page";
import ProjectLayout from "./app/projects/[projectId]/layout";

function App() {
  return (
    <div className="bg-background">
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/project" element={<ProjectsPage />} />
        <Route path="/project/:projectId" element={<ProjectLayout />}>
          <Route element={<Project />} index />
          <Route path="chat/:id" element={<Chat />} />
          <Route path="api-keys" element={<ApiKeys />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
