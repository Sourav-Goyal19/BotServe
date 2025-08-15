import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import Middleware from "./components/middleware.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <Router>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
      <Toaster />
      <Middleware />
    </QueryClientProvider>
  </Router>
);
