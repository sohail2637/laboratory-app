import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideMenu from "./SideMenu";

function Layout() {
  return (
    <>
      <div className="md:h-16">
        <Header />
      </div>
      <div className="grid grid-cols-12 bg-gray-100 items-start min-h-[100vh] py-3 lg:py-0">
        {/* Sidebar */}
        <div className="col-span-2 h-screen sticky top-0 hidden lg:flex">
          <SideMenu />
        </div>
        
        {/* Main Content */}
        <div className="col-span-10 h-full p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
