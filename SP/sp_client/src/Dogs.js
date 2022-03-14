import React, { useEffect } from "react";
import "./App.css";

function Dogs() {
  useEffect(() => {
    getDogs();
  });

  const getDogs = async () => {
    const res = await fetch("http://localhost:4000/dogs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        "Content-Type": "application/json",
      },
    });

    // Parse response and display alert accordingly
    let parsed_resp = await res.json();
    console.log("Dogs: ", JSON.stringify(parsed_resp, 0, 2));
  };

  return (
    <div>
      <h3>Dogs page</h3>
    </div>
  );
}

export default Dogs;
