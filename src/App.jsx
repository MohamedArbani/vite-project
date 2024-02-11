import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./Home";
import Login from "./components/login";
import Sidebar from "./components/Sidebar";
//import DashboardComponent from './DashboardComponent'

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="grid-container">
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <Header OpenSidebar={OpenSidebar} />
          <Home />
        </div>
      ) : (
        <div style={{ height: "100dvh", backgroundColor: "#051132", display: "flex", justifyContent:"center", alignItems:"center" }}>
          <Login />
        </div>
      )}
    </>
  );
}

export default App;
