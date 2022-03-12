import { useParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { Authenticate } from '../../Utils/WebAuthnUtils';
import './Interaction.css';

function OIDC_Login() {

  // Login state variables
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [name, setName] = useState(null);

  let {uid} = useParams();
  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    // Authenticate user first
    const user = {
      name: name,
      email: email,
      username: username,
    };
    let authentication_successful = await Authenticate(user);

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
      const parsed_scope = data.scope;
      navigate("/oidc_interaction/" + parsed_new_uid + "/consent/" + parsed_scope);

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
