import "./Login.css";
import {
  Alert,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  TextField,
  Box,
  Container,
} from "@mui/material";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Authenticate } from "../../Utils/WebAuthnUtils";
import GetFingerprint from "../../Utils/GetFingerprint";
import {
  ValidateFingerprint,
  SaveFingerprint,
} from "../../Utils/ValidateFingerprint";
import { AppContext } from "../App/context";

function LoginPage() {
  const navigate = useNavigate();
  const { dispatchUserEvent } = useContext(AppContext);
  const [showError, setShowError] = useState(false);
  const [showTrustDevice, setShowTrustDevice] = useState(false);

  const handleLogIn = async (e) => {
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

      // Check if device needs to be added as a trusted device
      const device_trusted = await ValidateFingerprint();
      console.log("DEVICE TRUSTED: ", device_trusted);

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

  const handleLostAuthenticator = async () => {
    console.log("Lost your key pressed");
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
          <Alert severity="error">Log in failed.</Alert>
        </Collapse>

        <Box component="form" onSubmit={handleLogIn} sx={{ mt: 2 }}>
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
            Log In
          </Button>

          <Link
            variant="body2"
            color="secondary"
            onClick={handleLostAuthenticator}
          >
            Lost your key?
          </Link>

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

export default LoginPage;
