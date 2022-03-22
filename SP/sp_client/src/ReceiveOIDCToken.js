import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./context";
import "./App.css";

function ReceiveOIDCToken() {
  const { access_token } = useParams();
  const navigator = useNavigate();
  const { dispatchUserEvent } = useContext(AppContext);

  useEffect(() => {
    validate_token().then((response) => {
      if (!response?.error) {
        if (response?.user && response?.token) {
          // Set user and bearer token in localstorage
          localStorage.setItem("jwt_token", response?.token);
          localStorage.setItem("user", JSON.stringify(response?.user));
          // set user globally
          dispatchUserEvent("SET_USER", response?.user);
          // redirect to /
          navigator("/");
        }
      } else {
        //error; user could not be registered
      }
    });
  });

  const validate_token = async () => {
    const res = await fetch("http://localhost:4000/oidc/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ access_token: access_token }),
    });

    // Parse response and display alert accordingly
    let parsed_resp = await res.json();
    return parsed_resp;
  };

  return <div></div>;
}

export default ReceiveOIDCToken;
