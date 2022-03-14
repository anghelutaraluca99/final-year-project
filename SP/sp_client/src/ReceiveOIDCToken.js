import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./App.css";

function ReceiveOIDCToken() {
  const { access_token } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    validate_token().then((response) => {
      if (!response?.error) {
        if (response?.user && response?.token) {
          localStorage.setItem("jwt_token", response?.token);
          localStorage.setItem("user", response?.user);
          navigator("/");
        }
      }
    });
  });

  const validate_token = async () => {
    const res = await fetch("http://localhost:4000/access_token", {
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
