import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Dashboard = ({ setSearchResult }) => {
  const navigate = useNavigate();
  const url = useLocation();

  useEffect(() => {
    if (url.pathname === "/") navigate("/posts");
  }, [navigate, url.pathname]);

  return (
    <div className="h-full font-montserrat">
      <Header setSearchResult={setSearchResult} />
      <div className="flex h-[90vh]">
        <Sidebar />
        <div className="bg-gray-200 w-4/5 h-full overflow-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
