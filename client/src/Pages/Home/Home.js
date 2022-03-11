import React from 'react';
import {useState, useEffect} from 'react';
import './Home.css';
import GetUser from '../../Utils/GetUser';

function HomePage() {
    const [message, setMessage] = useState(null);

    const digestApiResponse = async (resp) => {

        if(resp?.error) {
            setMessage("Please log in");
        } else {
            setMessage("Hello, " + resp?.name + "!");
        }
    }

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
