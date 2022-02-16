import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './App.css';

function Settings() {
    
    const navigate = useNavigate();

    let handleSelect = (e) => {
        if(e.target.value === "Delete Authenticator"){ 
            navigate("/deleteAuthenticator");
        }
    }


    return (
        <div>
            <h3>Settings Page</h3>

            <button onClick={handleSelect} value="Delete Authenticator">Delete Authenticator</button>
            <button onClick={handleSelect} value="Register New Authenticator">Register New Authenticator</button>

        </div>
    );
}

export default Settings;
