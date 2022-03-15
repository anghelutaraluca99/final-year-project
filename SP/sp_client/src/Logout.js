import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./context";

function Logout() {
  const navigate = useNavigate();
  const { dispatchUserEvent } = useContext(AppContext);

  useEffect(() => {
    fetch("http://localhost:4000/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      credentials: "include",
    }).then(() => {
      dispatchUserEvent("LOGOUT_USER", {});
      navigate("/");
    });
  });

  return <div>You are logged out.</div>;
}

export default Logout;
