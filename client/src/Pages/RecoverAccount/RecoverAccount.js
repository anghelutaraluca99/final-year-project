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
import { GetFingerprint } from "../../Utils/FingerprintUtils";
import { AccountRecovery } from "../../Utils/WebAuthnUtils";
import { AppContext } from "../App/context";

function RecoverAccount() {
  const navigate = useNavigate();
  const { dispatchUserEvent } = useContext(AppContext);
  const [showError, setShowError] = useState(null);

  const handleRecoverAccount = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const user = {
      email: data.get("email"),
      username: data.get("username"),
      name: data.get("name"),
    };

    const fingerprint = await GetFingerprint();
    let account_recovery_successful = await AccountRecovery(user, fingerprint);
    if (!account_recovery_successful?.error) {
      // Set user globally
      dispatchUserEvent("SET_USER", account_recovery_successful?.user);
      navigate("/");
    } else {
      setShowError(account_recovery_successful?.error);
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

        <Box component="form" onSubmit={handleRecoverAccount} sx={{ mt: 2 }}>
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
            sx={{ mb: 1 }}
          >
            Recover Account
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default RecoverAccount;
