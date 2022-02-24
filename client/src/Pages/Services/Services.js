import React from 'react';
import { useNavigate } from "react-router-dom";
import './Services.css';
import GetUser from '../../Utils/GetUser';
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
        let services = await resp.json();
        return services;
    }

    const getAssertion = async () => {
        let resp = await fetch('http://localhost:3000/saml_assertion', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`
            },
        });
        let assertion = await resp.text();
        console.log("ASSERTION " + assertion);
        let encoded_assertion = encodeURI(assertion);
        console.log("ENCODED ASSERTION " + encoded_assertion);
        return assertion;
    }

    const selectService = async (e) => {
        let service = services[e.target.value];
        let assertion = getAssertion();
        // console.log(assertion);
        // let encoded_assertion = encodeURI(assertion);
        // console.log(encoded_assertion);

        // let resp = await fetch(service.url + "/saml_assertion?assertion=" + encoded_assertion, {
        //     method: 'POST',
        // });
        // console.log(resp);
        // window.location.href = service.url + "/saml_assertion?assertion=" + encoded_assertion;
    };

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
                    <li onClick={selectService} className = "service_link" key = {service.name} value = {service.url}>
                        {service.name}
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
