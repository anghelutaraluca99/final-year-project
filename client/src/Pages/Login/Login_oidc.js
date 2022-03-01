import { useParams } from 'react-router-dom';
import './Login.css';

function Login_oidc() {

    let {uid} = useParams();
    console.log(uid);

    return (
        <div>
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
        </div>
    );
    
}

export default Login_oidc;
