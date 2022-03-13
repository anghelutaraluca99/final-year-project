import "./Register.css";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Register } from "../../Utils/WebAuthnUtils";
import { useNavigate } from "react-router-dom";
import {
  ValidateFingerprint,
  SaveFingerprint,
} from "../../Utils/FingerprintUtils";
import { AppContext } from "../App/context";

function RegistrationPage() {
  const navigate = useNavigate();

  const { dispatchUserEvent } = useContext(AppContext);
  const [showError, setShowError] = useState(false);
  const [showTrustDevice, setShowTrustDevice] = useState(false);

  const handleRegister = async (e) => {
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
      // Set user globally
      dispatchUserEvent("SET_USER", user);

      // Check if device needs to be added as a trusted device
      const device_trusted = await ValidateFingerprint();
      if (device_trusted) {
        await SaveFingerprint();
        navigate("/");
      } else {
        setShowTrustDevice(true);
      }
    } else {
      setShowError(true);
      clearAlerts();
    }
  };

  const handleTrustDevice = async () => {
    await SaveFingerprint();
    setShowTrustDevice(false);
    navigate("/");
  };

  const handleDoNotTrustDevice = () => {
    setShowTrustDevice(false);
    navigate("/");
  };

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

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
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

          <Dialog
            open={showTrustDevice}
            onClose={handleDoNotTrustDevice}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Trust this device?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Trusting this device means anyone with access to it could also
                gain access to your account.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDoNotTrustDevice} autoFocus>
                Do not trust
              </Button>
              <Button onClick={handleTrustDevice}>Trust</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </div>
  );
}

export default RegistrationPage;
