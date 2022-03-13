import "./Register.css";
import {
  Alert,
  Collapse,
  Button,
  TextField,
  Box,
  Container,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Register } from "../../Utils/WebAuthnUtils";
import { useNavigate } from "react-router-dom";
import GetFingerprint from "../../Utils/GetFingerprint";
import { AppContext } from "../App/context";

function RegistrationPage() {
  const navigate = useNavigate();

  const { dispatchUserEvent } = useContext(AppContext);
  const [showError, setShowError] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    // Register user first
    const data = new FormData(e.currentTarget);
    const user = {
      email: data.get("email"),
      username: data.get("username"),
      name: data.get("name"),
    };
    const registration_successful = await Register(user);

    if (registration_successful) {
      // Set user globally + register fingerprint
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
          <Alert severity="error">Registration failed.</Alert>
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
            fullWidth
            variant="contained"
            sx={{
              background: "darkolivegreen",
              color: "blanchedalmond",
              mt: 3,
              mb: 2,
            }}
          >
            Register
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default RegistrationPage;
