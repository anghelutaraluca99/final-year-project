import { Backdrop, CircularProgress, Button } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App/context";

function LogoutPage() {
  const navigate = useNavigate();
  const { dispatchUserEvent } = useContext(AppContext);

  // const handleLogout = () => {
  useEffect(() => {
    dispatchUserEvent("LOGOUT_USER", {});
    navigate("/");
  }, []);

  // }

  return <div>You are logged out.</div>;
}

export default LogoutPage;
