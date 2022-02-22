import React, {useState} from 'react';
import { Link, useNavigate } from "react-router-dom";
import './App.css';

function Auth() {
    async function handleLogIn(e) {
        e.preventDefault();

        const resp = await fetch('http://localhost:4000/login', {
            method: 'GET',
        });

        console.log(resp);

        // TODO :: send request to and handle response from SP_server

    }

    return (
        <div>
            <h3> Authentication Page </h3><br/>
            <button onClick={handleLogIn}>Log in with Identity Provider</button>
        </div>
    );
}

export default Auth;
