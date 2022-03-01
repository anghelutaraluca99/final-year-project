import { useParams } from 'react-router-dom';
import {useState, useEffect} from 'react';
import './Interaction.css';
import GetUser from '../../Utils/GetUser';

function Interaction() {

    const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

    let {uid} = useParams();
    console.log(uid);

    const digestApiResponse = async (resp) => {

        if(resp?.error) {
            setUserIsLoggedIn(false);
        } else {
            setUserIsLoggedIn(true);
        }
    }

    const handleLogin = async () => {

    }

    const handleConsent = async () => {
        
    }

    useEffect(() => {
        GetUser().then(resp => digestApiResponse(resp));
    }, [])

    return (
        <div>
            {!userIsLoggedIn && <div>
                <h3> Authentication Page </h3><br/>
                {/*TODO: update to use FORMIK*/}
                <form>
                    <label>Email address:</label><br/>
                    <input name="email" type="text" /><br/><br/>
                    <label>Username:</label><br/>
                    <input name="username" type="text"/><br/><br/>
                    <label>Name:</label><br/>
                    <input name="name" type="text"/><br/><br/>
                    <input type="submit" value="Log In"/>
                </form>
            </div>}
            {userIsLoggedIn && <div>
                <h3> Consent Page </h3><br/>
                <button>Give consent</button>
            </div>}
        </div>



    );
}

export default Interaction;
