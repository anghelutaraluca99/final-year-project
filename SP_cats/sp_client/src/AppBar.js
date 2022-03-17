import React from "react";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./context";
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

const pages = ["Cats"];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [userSettings, setUserSettings] = useState([
    { name: "Login", path: "/login" },
  ]);

  const { user } = useContext(AppContext);
  useEffect(() => {
    if (user) {
      setUserSettings([{ name: "Logout", path: "/logout" }]);
    } else {
      setUserSettings([{ name: "Login", path: "/login" }]);
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
    <AppBar position="static" sx={{ pr: 1 }}>
      <Toolbar disableGutters>
        {/* NAV MENU */}
        <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "flex" } }}>
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
              <MenuItem
                key={`menuItem${page}`}
                component={Link}
                to={"/cats"}
                onClick={handleCloseNavMenu}
              >
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Display name of WebApp */}
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "flex", mx: 5 } }}>
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
            Cats as a service 😸
          </Typography>
        </Box>

        {/* USER MENU */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {user && (
                <Avatar alt={user?.name} src="/static/images/avatar/2.jpg" />
              )}
              {!user && <Avatar src="/static/images/avatar/2.jpg" />}
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
            {userSettings.map((setting, idx) => (
              <MenuItem
                key={`menuItem${idx}`}
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
