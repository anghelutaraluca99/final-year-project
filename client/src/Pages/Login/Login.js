import './Login.css';
import React, {useContext, useState} from 'react';
import { useNavigate } from "react-router-dom";
import { Authenticate } from '../../Utils/WebAuthnUtils';
import GetFingerprint from '../../Utils/GetFingerprint';
import { AppContext } from '../App/context';

function LoginPage() {

    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [name, setName] = useState(null);
    const navigate = useNavigate();
    const { dispatchUserEvent } = useContext(AppContext);
    async function handleSubmit(e) {
        e.preventDefault();

        const user = {
            name: name,
            email: email,
            username: username,
            };
        let authentication_successful = await Authenticate(user);

        if(authentication_successful){
            dispatchUserEvent('SET_USER', user);
            // Send fingerprint to BE
            const fingerprint = await GetFingerprint();
            navigate("/");
        } else {
            //TODO :: Display error
        }
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

export default LoginPage;
