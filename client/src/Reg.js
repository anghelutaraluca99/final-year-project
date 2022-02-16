import React, {useState} from 'react';
import './App.css';
import {startRegistration} from '@simplewebauthn/browser';

function Reg() {
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);

    async function handleSubmit(e){
        e.preventDefault();

        let respObj = {};
        respObj.name = name;
        respObj.email = email;
        respObj.username = username;

        // GET registration options from the endpoint that calls
        // @simplewebauthn/server -> generateRegistrationOptions()
        const resp = await fetch('http://localhost:3000/pre_register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(respObj),
        });

        let parsedResp = await resp.json();

        if(typeof(parsedResp?.error) !== "undefined") {
            // If response contains an error
            console.log(parsedResp.error);
        } else {
            // eslint-disable-next-line
            let attResp;
            try {
                // Pass the options to the authenticator and wait for a response
                respObj.attResp = await startRegistration(parsedResp);
            } catch (error) {
                if (error.name === 'InvalidStateError') {
                    console.log("Error: Authenticator was probably already registered by user");
                } else {
                    console.log(error);
                }
                throw error;
            }

            // POST the response to the endpoint that calls
            // @simplewebauthn/server -> verifyRegistrationResponse()
            const verificationResp = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(respObj),
            });

            // Wait for the results of verification
            const verificationJSON = await verificationResp.json();

            // Log answer saved in 'verified'
            if (verificationJSON && verificationJSON.verified) {
                console.log("Success!!!!")
            } else {
                console.log(verificationJSON);
            }
        }
    }

    return (
        <div>
            <h3> Registration Page </h3><br/>
            {/*TODO: update to use FORMIK*/}
            <form onSubmit={handleSubmit}>
                <label>Email address:</label><br/>
                <input name="email" type="text" onChange={(e) => {setEmail(e.target.value);}}/><br/><br/>
                <label>Username:</label><br/>
                <input name="username" type="text" onChange={(e) => {setUsername(e.target.value); }}/><br/><br/>
                <label>Name:</label><br/>
                <input name="name" type="text" onChange={(e) => {setName(e.target.value); }}/><br/><br/>
                <input type="submit" value="Create Account"/>
            </form>
        </div>
    );
}

export default Reg;
