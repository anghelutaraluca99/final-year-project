import "./Login.css";
import {
  Alert,
  Button,
  Collapse,
  TextField,
  Box,
  Container,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Authenticate } from "../../Utils/WebAuthnUtils";
import GetFingerprint from "../../Utils/GetFingerprint";
import { AppContext } from "../App/context";

function LoginPage() {
  const navigate = useNavigate();
  const { dispatchUserEvent } = useContext(AppContext);
  const [showError, setShowError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const user = {
      email: data.get("email"),
      username: data.get("username"),
      name: data.get("name"),
    };

    let authentication_successful = await Authenticate(user);
    if (authentication_successful) {
      // Set user globally
      dispatchUserEvent("SET_USER", user);
      await GetFingerprint();
      navigate("/");
    } else {
      setShowError(true);
      clearAlerts();
    }
  }

  const clearAlerts = () => {
    setTimeout(() => {
      setShowError(false);
    }, 1000 * 3);
  };

  return (
    <div>
      <Container component="main" maxWidth="xs" sx={{ mt: 2 }}>
        <Collapse in={showError}>
          <Alert severity="error">Log in failed.</Alert>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            key="email"
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
            key="username"
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
            key="name"
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
            // color="primary"
            // sx={{background: "darkolivegreen", color: "blanchedalmond", mt: 3, mb: 2 }}
          >
            Log In
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default LoginPage;
