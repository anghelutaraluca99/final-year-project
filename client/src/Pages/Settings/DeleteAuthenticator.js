import React from 'react';
import {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import './Settings.css';

function DeleteAuthenticator() {
    const [authenticators, setAuthenticators] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const navigate = useNavigate();

    const digestApiResponse = async (data) => {
        const parsedData = await data.json();
        console.log(parsedData);
        if(data.status === 200) {
            setAuthenticators(parsedData);
        } else {
            console.log("Error when fetching authenticators");
        }
    }

    useEffect(() => {
        fetch('http://localhost:3000/authenticators', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
        }).then(data => digestApiResponse(data));
    }, [])

    function handleSelect(e) {
        setToDelete(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let res;
        if(toDelete){
            let respObj = {};
            respObj.credentialID = toDelete;
            console.log(respObj);
                res = await fetch('http://localhost:3000/authenticators', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(respObj),
            }); 
            if(res === true) 
                navigate("/");
        }
    }

    return (
        <div>
            {authenticators && <form onSubmit={handleSubmit}>
            <h3>Select an authenticator to be deleted</h3>
            <select name="authenticator" multiple>
                <option value ="none">Nothing</option>
                {
                    authenticators.map(authenticator => 
                        <option onClick={handleSelect} key= {authenticator.credentialID} value={authenticator.credentialID}>{authenticator.credentialID}</option>)
                }
            </select> 
            <p><input type="submit" value="Submit"></input></p>
            </form>}
        </div>
    );
}

export default DeleteAuthenticator;
