import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Auth() {
  async function handleLogIn(e) {
    e.preventDefault();
    window.location.replace("http://localhost:4000/login");
  }

  return (
    <div>
      <h3> Authentication Page </h3>
      <br />
      <button onClick={handleLogIn}>Log in with OIDC Identity Provider</button>
    </div>
  );
}

export default Auth;
