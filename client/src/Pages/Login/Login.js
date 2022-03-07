import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {startAuthentication} from '@simplewebauthn/browser';
import GetFingerprint from '../../Utils/GetFingerprint';

import './Login.css';

function Login() {

    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        let respObj = {};
        respObj.name = name;
        respObj.email = email;
        respObj.username = username;

        // GET authentication options
        const resp = await fetch('http://localhost:3000/user/pre_authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(respObj),
        });

        // eslint-disable-next-line
        let asseResp;
        try {
            // Pass the options to the authenticator and wait for a response
            respObj.asseResp = await startAuthentication(await resp.json());
        } catch (error) {
            throw error;
        }

        const verificationResp = await fetch('http://localhost:3000/user/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(respObj),
        });

        // Wait for the results of verification
        const responseJSON = await verificationResp.json();
        console.log(responseJSON);

        // Put jtw login token in local storage
        if(responseJSON?.token) {
            localStorage.setItem("jwt_token", responseJSON.token);
            localStorage.setItem("username", responseJSON.user.username);
        }

        // Send fignerprint to backend
        const fingerprint = await GetFingerprint();

        navigate("/");
    }


    return (
        <div>
            <h3> Authentication Page </h3><br/>
            {/*TODO: update to use FORMIK*/}
            <form onSubmit={handleSubmit}>
                <label>Email address:</label><br/>
                <input name="email" type="text" onChange={(e) => {setEmail(e.target.value) }}/><br/><br/>
                <label>Username:</label><br/>
                <input name="username" type="text" onChange={(e) => {setUsername(e.target.value);}}/><br/><br/>
                <label>Name:</label><br/>
                <input name="name" type="text" onChange={(e) => {setName(e.target.value);}}/><br/><br/>
                <input type="submit" value="Log In"/>
            </form>
        </div>
    );
}

export default Login;
