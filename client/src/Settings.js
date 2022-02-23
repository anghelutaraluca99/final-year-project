import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import {startRegistration} from '@simplewebauthn/browser';
import './App.css';
import GetUser from './GetUser';
import {useState, useEffect} from 'react';

function Settings() {
    
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const digestApiResponse = async (resp) => {

        if(resp?.error) {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }

    useEffect(() => {
        GetUser().then(resp => digestApiResponse(resp));
    }, [])


    let handleRegistration = async () => {
        // GET registration options from the endpoint that calls
        // @simplewebauthn/server -> generateRegistrationOptions()
        const resp = await fetch('http://localhost:3000/pre_register_new_authenticator', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
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
                attResp = await startRegistration(parsedResp);
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
            const verificationResp = await fetch('http://localhost:3000/register_new_authenticator', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({attResp: attResp}),
            });

            // Wait for the results of verification
            const verificationJSON = await verificationResp.json();
            console.log(verificationJSON);
            // Log answer saved in 'verified'
            if (verificationJSON && verificationJSON.verified) {
                console.log("Success!!!!")
            } else {
                console.log(verificationJSON);
            }
        }
    }

    let handleSelect = (e) => {
        if(e.target.value === "Delete Authenticator"){ 
            navigate("/deleteAuthenticator");
        } 
        if(e.target.value === "Register New Authenticator"){
            handleRegistration();
        }
    }

    return (
        <>
        {visible && <div>
            <h3>Settings Page</h3>
            <button onClick={handleSelect} value="Delete Authenticator">Delete Authenticator</button>
            <button onClick={handleSelect} value="Register New Authenticator">Register New Authenticator</button>

        </div>}
        {!visible && <div>
            <h3>Unauthorised, please log in.</h3>

        </div>}
        </>
    );
}

export default Settings;
