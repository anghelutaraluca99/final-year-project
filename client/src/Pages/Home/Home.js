import './Home.css';
import React from 'react';
import {useState, useEffect, useContext} from 'react';
import GetUser from '../../Utils/GetUser';
import { AppContext } from '../App/context';

function HomePage() {

    const [message, setMessage] = useState(null);
    const { user, dispatchUserEvent } = useContext(AppContext);

    const digestApiResponse = async (resp) => {
        // if no user is set; retrieve user from resp
        if(!user) {
            if(resp?.error) {
                setMessage("Please log in");
            } else {
                const cookie_user = {
                    name: resp?.name,
                    email: resp?.email,
                    username: resp?.username,
                }
                dispatchUserEvent('SET_USER', cookie_user);
                setMessage("Hello, " + cookie_user?.name + "!");
            }
        } else {
            setMessage("Hello, " + user?.name + "!");
        }
    }

    // retrieve user from cookie
    useEffect(() => {
        GetUser().then(resp => digestApiResponse(resp));
    }, [])

    return (
        <div>
            <h3>Home page</h3>
            {message && <h5>{message}</h5>}
        </div>
    );
}

export default HomePage;
