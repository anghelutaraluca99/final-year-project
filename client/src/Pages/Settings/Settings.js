import './Settings.css';
import React from 'react';
import { useNavigate } from "react-router-dom";
import GetUser from '../../Utils/GetUser';
import {useState, useEffect} from 'react';
import { RegisterNewAuthenticator } from "../../Utils/WebAuthnUtils"

function SettingsPage() {
    
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
        let registration_successful = await RegisterNewAuthenticator();
        if(registration_successful) {
            // show successful
        } else {
            //display error
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

export default SettingsPage;
