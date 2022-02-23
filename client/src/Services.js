import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './App.css';
import GetUser from './GetUser';
import {useState, useEffect} from 'react';

function Services() {
    
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [services, setServices] = useState(null);

    const getServices = async () => {
        let resp = await fetch('http://localhost:3000/services', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
        });
        console.log(resp);
        let services = await resp.json();
        console.log(services);
        return services;
    }

    const digestApiResponse = async (resp) => {

        if(resp?.error) {
            setVisible(false);
        } else {
            setVisible(true);
            setServices(await getServices());
        }
    }

    useEffect(() => {
        if(visible && services)
            return;
        GetUser().then(resp => digestApiResponse(resp));
    });

    return (
        <>
        {visible && <div>
            <h3>Services Page</h3>
            {services && <ul>
                {services.map(service => (
                    <li key = {service.name}>
                        <a class = "service_link" href={service.url}>{service.name}</a>
                    </li>
                ))}
            </ul>}
        </div>}
        {!visible && <div>
            <h3>Unauthorised, please log in.</h3>
        </div>}
        </>
    );
}

export default Services;
