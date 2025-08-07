import Chat from "./components/chat";
// import Header from "./components/header";
import SignIn from "./components/sign-in";
import SignUp from "./components/sign-up";
// import Sidebar from "./components/sidebar";
import HomeChat from "./components/home-chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="h-screen w-full flex flex-col bg-background">
        {/* <Header /> */}

        <div className="flex flex-1 w-full overflow-hidden">
          {/* <Sidebar /> */}
          <Routes>
            <Route path="/" element={<HomeChat />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/chat/:id" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
