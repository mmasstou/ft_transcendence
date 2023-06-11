"use client"
import { useState, useEffect } from "react";
import SidebarMobile from "./sidebar/SidebarMobile";
import DesktopSidebar from "./sidebar/DesktopSidebar";

const Sidebar = () => {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      const handleResize = () => {
        const screenWidth = window.innerWidth;
        setIsMobile(screenWidth <= 767);
      };
  
      handleResize();
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    return isMobile ? <SidebarMobile /> : <DesktopSidebar />;
  };
  
  export default Sidebar;
