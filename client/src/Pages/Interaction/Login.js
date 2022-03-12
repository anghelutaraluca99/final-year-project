import './Interaction.css';
import { Button, TextField, Box, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import React, {useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { Authenticate } from '../../Utils/WebAuthnUtils';
import GetFingerprint from '../../Utils/GetFingerprint';
import { AppContext } from '../App/context';

function OIDC_Login() {

  const navigate = useNavigate();
  let {uid} = useParams();
  const {dispatchUserEvent} = useContext(AppContext);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Authenticate user first
    const data = new FormData(e.currentTarget);
    const user = {
      email: data.get('email'),
      username: data.get('username'),
      name: data.get('name'),
    }
    let authentication_successful = await Authenticate(user);


    if(authentication_successful) {
      // Set user globally + send fingerprint to BE
      dispatchUserEvent('SET_USER', user);
      const fingerprint = await GetFingerprint();

      // reply to OIDC endpoint
      const oidc_resp = await fetch('http://localhost:3000/oidc_interaction/' + uid + '/login', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        credentials: 'include',
      });

      // Navigate to consent page
      const resp = await oidc_resp.json();
      const parsed_new_uid = resp.uid;
      const parsed_scope = resp.scope;
      navigate("/oidc_interaction/" + parsed_new_uid + "/consent/" + parsed_scope);

    } else {
      // Display error
    }
  }

  return (
    <div>
        <Container component="main" maxWidth="xs">
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            />
            <TextField
            margin="normal"
            required
            fullWidth
            name="username"
            label="Username"
            type="username"
            id="username"
            autoComplete="username"
            />
            <TextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="Full name"
            type="name"
            id="name"
            autoComplete="name"
            />
            <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{background: "darkolivegreen", color: "blanchedalmond", mt: 3, mb: 2 }}
            >
            Log In
            </Button>
          </Box>
        </Container>
    </div>
  );
}

export default OIDC_Login;
