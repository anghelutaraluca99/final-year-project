import React, {useState} from 'react';
import './App.css';
import {startAuthentication} from '@simplewebauthn/browser';

function Auth() {

    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();

        let respObj = {};
        respObj.name = name;
        respObj.email = email;
        respObj.username = username;

        console.log("before 1st post");

        // GET authentication options
        const resp = await fetch('http://localhost:3000/pre_authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(respObj),
        });



        let asseResp;
        try {
            // Pass the options to the authenticator and wait for a response
            respObj.asseResp = await startAuthentication(await resp.json());
        } catch (error) {
            throw error;
            console.log(error);
        }

        const verificationResp = await fetch('http://localhost:3000/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(respObj),
        });

        // Wait for the results of verification
        const verificationJSON = await verificationResp.json();
    }


    return (
        <div>
            <h3> Authentication Page </h3><br/>
            {/*TODO: update to use FORMIK*/}
            <form onSubmit={handleSubmit}>
                <label>Email address:</label><br/>
                <input name="email" type="text" onChange={(e) => {setEmail(e.target.value);console.log(email); }}/><br/><br/>
                <label>Username:</label><br/>
                <input name="username" type="text" onChange={(e) => {setUsername(e.target.value);console.log(username); }}/><br/><br/>
                <label>Name:</label><br/>
                <input name="name" type="text" onChange={(e) => {setName(e.target.value);console.log(name); }}/><br/><br/>
                <input type="submit" value="Log In"/>
            </form>
        </div>
    );
}

export default Auth;
