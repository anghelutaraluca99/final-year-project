import {
  Alert,
  Button,
  Collapse,
  TextField,
  Box,
  Container,
  Typography,
  Paper,
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetFingerprint } from "../../Utils/FingerprintUtils";
import { AccountRecovery } from "../../Utils/WebAuthnUtils";
import { AppContext } from "../App/context";

function RecoverAccount() {
  const navigate = useNavigate();
  const { dispatchUserEvent } = useContext(AppContext);
  const [showError, setShowError] = useState(null);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    setCollapse(true);
  }, []);

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
    <div className="CenterForm">
      <Container maxWidth="xs">
        <Collapse in={collapse}>
          <Paper elevation={12} sx={{ px: 2, py: 6 }}>
            <Collapse in={showError !== null}>
              <Alert severity="error">{showError}</Alert>
            </Collapse>
            <Typography variant="h4" color="primary">
              Account Recovery
            </Typography>
            <Box
              component="form"
              onSubmit={handleRecoverAccount}
              sx={{ mt: 4 }}
            >
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
                key="register"
                fullWidth
                variant="contained"
                sx={{ mt: 0.5 }}
              >
                Recover
              </Button>
            </Box>
          </Paper>
        </Collapse>
      </Container>
    </div>
  );
}

export default RecoverAccount;
