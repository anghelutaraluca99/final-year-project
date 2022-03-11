import { useParams } from 'react-router-dom';
import './Interaction.css';

function Interaction() {

  let {uid, scope} = useParams();

  const handleConsent = async (e) => {

    e.preventDefault();
    
    // Reply to OIDC endpoint
    const OIDC_consent_response = await fetch('http://localhost:3000/oidc_interaction/' + uid + '/consent', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      credentials: 'include',
    });

    console.log("------- OIDC consent response: ", OIDC_consent_response);

  }

  return (
    <div>
      <div>
        <h3> Single Sign-On Consent Page </h3>
        <p> Allow application to gain access to your {scope} ?</p>
        <button onClick={handleConsent}>Give consent</button>
      </div>
    </div>
  );
}

export default Interaction;
