import React from 'react';
import './App.css';
import {useLocation} from "react-router-dom";

function SAMLAssertion() {

    const search = useLocation().search;
    const assertion = new URLSearchParams(search).get('assertion');

    console.log(assertion);

    return (
        <div>
            <h3>SAML Assertion page</h3>
        </div>
    );
}

export default SAMLAssertion;
