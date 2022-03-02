import { useParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import {startAuthentication} from '@simplewebauthn/browser';
import './Interaction.css';
import GetUser from '../../Utils/GetUser';

function Interaction() {

    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

    // Login state variables
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);


    let {uid} = useParams();
    console.log(uid);

    const digestApiResponse = async (resp) => {

        if(resp?.error) {
            setUserIsLoggedIn(false);
        } else {
            setUserIsLoggedIn(true);
        }
    }

    const handleLogin = async (e) => {

        e.preventDefault();

        let respObj = {};
        respObj.name = name;
        respObj.email = email;
        respObj.username = username;

        // GET authentication options
        const resp = await fetch('http://localhost:3000/pre_authenticate', {
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

        const verificationResp = await fetch('http://localhost:3000/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(respObj),
        });

        // Wait for the results of verification
        const responseJSON = await verificationResp.json();
        console.log(responseJSON);
        if(responseJSON?.token) {
            localStorage.setItem("jwt_token", responseJSON.token);
            setUserIsLoggedIn(true);
        }

        const oidc_resp = await fetch('http://localhost:3000/oidc_interaction/' + uid + '/login', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
        });

        console.log(oidc_resp);
    }

    const handleConsent = async (e) => {

        e.preventDefault();

        let resp = await fetch('http://localhost:3000/oidc_interaction/' + uid + '/consent', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
        });

        console.log(resp);

    }

    useEffect(() => {
        GetUser().then(resp => digestApiResponse(resp));
    }, [])

    return (
        <div>
            {!userIsLoggedIn && <div>
                <h3> Authentication Page </h3><br/>
                {/*TODO: update to use FORMIK*/}
                <form onSubmit={handleLogin}>
                <label>Email address:</label><br/>
                <input name="email" type="text" onChange={(e) => {setEmail(e.target.value);}}/><br/><br/>
                <label>Username:</label><br/>
                <input name="username" type="text" onChange={(e) => {setUsername(e.target.value);}}/><br/><br/>
                <label>Name:</label><br/>
                <input name="name" type="text" onChange={(e) => {setName(e.target.value);}}/><br/><br/>
                <input type="submit" value="Log In"/>
            </form>
            </div>}
            {userIsLoggedIn && <div>
                <h3> Consent Page </h3><br/>
                <button onClick={handleConsent}>Give consent</button>
            </div>}
        </div>



    );
}

export default Interaction;
