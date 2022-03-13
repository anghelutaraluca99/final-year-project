import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../Pages/App/context";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

const pages = ["Services"];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userSettings, setUserSettings] = useState(["Login", "Register"]);

  const { user } = useContext(AppContext);
  useEffect(() => {
    if (user) {
      setUserSettings([
        { name: "Profile", path: "/profile" },
        { name: "Account", path: "/Account" },
        { name: "Manage Authenticators", path: "/manage_authenticators" },
        { name: "Logout", path: "/Logout" },
      ]);
    } else {
      setUserSettings([
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
      ]);
    }
  }, [user]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ px: 3 }}>
      <Toolbar disableGutters>
        {/* Displays the name of the Website in AppBar when menu icon is not visible */}
        <Typography
          variant="h5"
          noWrap
          component={Link}
          to={"/"}
          sx={{
            mr: 2,
            display: { xs: "flex", md: "flex" },
            textDecoration: "none",
            color: "white",
          }}
        >
          Final Year Project
        </Typography>

        {/* NAV MENU */}
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex" } }}>
          {/* Displays the menu icon */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          {/* Displays the menu and handles clicking the menu items */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block" },
            }}
          >
            {pages.map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* USER MENU */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt={user?.name?.toUpperCase()}
                src="/static/images/avatar/2.jpg"
              />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {userSettings.map((setting) => (
              <MenuItem
                key={setting}
                component={Link}
                to={setting.path}
                onClick={handleCloseUserMenu}
              >
                <Typography textAlign="center">{setting.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default ResponsiveAppBar;
