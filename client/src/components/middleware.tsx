import { useEffect } from "react";
import { axiosIns } from "@/lib/axios";
import type { UserType } from "@/types";
import { useUserStore } from "@/zustand/store";
import { useLocation, useNavigate } from "react-router-dom";

const Middleware = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, clearUser } = useUserStore();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosIns.get("/api/user/one");
        setUser(res.data.user as UserType);

        if (
          location.pathname === "/sign-in" ||
          location.pathname === "/sign-up" ||
          location.pathname === "/login"
        ) {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        if (
          location.pathname != "/sign-in" &&
          location.pathname != "/sign-up"
        ) {
          navigate("/sign-in");
        }
        clearUser();
      }
    };
    getUser();
  }, [location.pathname]);

  return null;
};

export default Middleware;
