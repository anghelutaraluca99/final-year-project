import { useParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import {startAuthentication} from '@simplewebauthn/browser';
import { useNavigate } from "react-router-dom";
import './Interaction.css';

function OIDC_Login() {

  // Login state variables
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);

  let {uid} = useParams();
  const navigate = useNavigate();

  const handleAuthentication = async (user) => {
    let respObj = {};
    respObj.name = user.name;
    respObj.email = user.email;
    respObj.username = user.username;

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
    console.log("Authentication response: ", responseJSON);
    if(responseJSON?.token) {
      localStorage.setItem("jwt_token", responseJSON.token);
      return true;
    }
    return false;
  }

  const handleLogin = async (e) => {

    e.preventDefault();

    // Authenticate user first
    const user = {
      name: name,
      email: email,
      username: username,
    };
    let authentication_successful = await handleAuthentication(user);

    if(authentication_successful) {
      // reply to OIDC endpoint
      const new_uid = await fetch('http://localhost:3000/oidc_interaction/' + uid + '/login', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        credentials: 'include',
      });

      // Navigate to consent page
      const data = await new_uid.json();
      const parsed_new_uid = data.uid;
      navigate("/oidc_interaction/" + parsed_new_uid + "/consent");

    } else {
      console.log("-------- FIDO authentication failed.")
    }
  }

  return (
    <div>
      <div>
        <h3> Single Sign-On Login </h3><br/>
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
      </div>
    </div>
  );
}

export default OIDC_Login;
