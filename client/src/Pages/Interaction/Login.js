import "./Interaction.css";
import {
  Alert,
  Button,
  Collapse,
  TextField,
  Box,
  Container,
} from "@mui/material";
import { useParams } from "react-router-dom";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Authenticate } from "../../Utils/WebAuthnUtils";
import { AppContext } from "../App/context";

function OIDC_Login() {
  const navigate = useNavigate();
  let { uid } = useParams();
  const [showError, setShowError] = useState(null);
  const { dispatchUserEvent } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Authenticate user first
    const data = new FormData(e.currentTarget);
    const email = data.get("email");

    let authentication_successful = await Authenticate(email);

    if (!authentication_successful?.error) {
      // Set user globally
      dispatchUserEvent("SET_USER", authentication_successful?.user);

      // reply to OIDC endpoint
      const oidc_resp = await fetch(
        "http://localhost:3000/oidc_interaction/" + uid + "/login",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
          credentials: "include",
        }
      );

      // Navigate to consent page
      const resp = await oidc_resp.json();
      const parsed_new_uid = resp.uid;
      const parsed_scope = resp.scope;
      navigate(
        "/oidc_interaction/" + parsed_new_uid + "/consent/" + parsed_scope
      );
    } else {
      setShowError(authentication_successful?.error);
      clearAlerts();
    }
  };

  const clearAlerts = () => {
    setTimeout(() => {
      setShowError(null);
    }, 1000 * 5);
  };

  return (
    <div>
      <Container component="main" maxWidth="xs" sx={{ mt: 2 }}>
        <Collapse in={showError !== null}>
          <Alert severity="error">{showError}</Alert>
        </Collapse>

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
            key="log_in"
            fullWidth
            variant="contained"
            sx={{ mb: 1 }}
          >
            Log In
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default OIDC_Login;
