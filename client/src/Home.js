import React from 'react';
import {useState, useEffect} from 'react';
import './App.css';

function Home() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [message, setMessage] = useState(null);

    const digestApiResponse = async (data) => {

        const parsedData = await data.json();
        console.log(parsedData);
        if(data.status === 200) {
            setMessage("Hello, " + parsedData?.name + "!");
        } else {
            if(data.status === 401) {
                setMessage("Please log in.");
            }
        }
        setIsLoaded(true);
    }

    useEffect(() => {
        fetch('http://localhost:3000/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
        }).then(data => digestApiResponse(data));
    }, [])

    return (
        <div>
            <h3>Home page</h3>
            {message && <h5>{message}</h5>}
        </div>
    );
}

export default Home;
