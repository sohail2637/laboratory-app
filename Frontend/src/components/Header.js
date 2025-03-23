import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import AuthContext from "../AuthContext";

const navigation = [
  { name: "Patient", href: "/" },
  { name: "Test", href: "/test-details" },
  { name: "Unit", href: "/unit-details" },
];

const userNavigation = [{ name: "Sign out", href: "./login" }];

export default function Header() {
  const authContext = useContext(AuthContext);
  const localStorageData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const toggleDrawer = (open) => {
    setOpenDrawer(open);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    authContext.signout();
    navigate("./login");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setOpenDrawer(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="min-h-full bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <img
              className="h-11 w-11 rounded-full cursor-pointer"
              src={require("../assets/logo.webp")}
              alt="Inventory Management System"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            {/* <IconButton color="inherit">
              <NotificationsIcon sx={{ color: "white" }} />
            </IconButton> */}
            <IconButton color="inherit" onClick={handleMenuClick}>
              <Avatar
                alt={localStorageData?.user?.name || "User"}
                src={localStorageData?.user?.imageUrl || ""}
                sx={{ width: 28, height: 28 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              sx={{ zIndex: 1301 }}
            >
              <MenuItem onClick={handleSignOut} sx={{ color: "black" }}>
                Sign out
              </MenuItem>
            </Menu>
          </div>

          {/* Mobile Navigation */}
          <div className="-mr-2 flex lg:hidden">
            <IconButton color="inherit" onClick={() => toggleDrawer(true)}>
              <MenuIcon sx={{ color: "white" }} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "80vw",
            maxWidth: "320px",
            backgroundColor: "#fff",
            color: "#000",
            "@media (min-width: 768px)": {
              width: "250px",
            },
          },
        }}
      >
        <div className="p-4 flex flex-col h-full justify-between">
          <div>
            <IconButton sx={{ color: "black" }} onClick={() => toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
            <List>
              {navigation.map((item) => (
                <ListItem
                  button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    toggleDrawer(false);
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
              <ListItem button onClick={handleSignOut} sx={{ color: "black" }}>
                <ListItemText primary="Sign out" />
              </ListItem>
            </List>
          </div>

          {/* User Info */}
          {localStorageData && (
            <div className="p-4 border-t border-gray-300 flex flex-col items-center">
              <Avatar
                alt={localStorageData.user?.name || "User"}
                src={localStorageData.user?.imageUrl || ""}
                sx={{ width: 54, height: 54 }}
              />
              <p className="font-semibold mt-2">
                {localStorageData.user?.firstName} {localStorageData.user?.lastName}
              </p>
              <p className="text-sm text-gray-500">{localStorageData.user?.email}</p>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
