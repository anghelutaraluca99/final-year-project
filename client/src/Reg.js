import React, {useState} from 'react';
import './App.css';
import axios from "axios";

function Reg() {
    const [email, setEmail] = useState(null);
    function handleSubmit(e){
        e.preventDefault();
        axios.post('http://localhost:8080/register',{email: email}).then(res => {
            console.log(res.data);
        })
        console.log("submitted");
    }
    return (
        <div>
            <h3> Registration Page </h3><br/>
            {/*TODO: update to use FORMIK*/}
            <form onSubmit={handleSubmit}>
                <label>Email address:</label><br/>
                <input name="email" type="text" onChange={(e) => {setEmail(e.target.value);console.log(email); }}/><br/><br/>
                <input type="submit" value="Create Account"/>
            </form>
        </div>
    );
}

export default Reg;
