import { useParams } from 'react-router-dom';
import './Consent.css';

function Consent() {

    let {uid} = useParams();
    console.log(uid);

    return (
        <div>
            <h3> OIDC Consent Page </h3><br/>
        </div>
    );
}

export default Consent;
