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
  Typography,
  Box,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Authenticate } from "../../Utils/WebAuthnUtils";
import {
  ValidateFingerprint,
  SaveFingerprint,
} from "../../Utils/FingerprintUtils";
import { AppContext } from "../App/context";
import HomePage from "../Home/Home";

function LoginPage() {
  const navigate = useNavigate();
  const { user, dispatchUserEvent } = useContext(AppContext);
  const [showError, setShowError] = useState(null);
  const [showTrustDevice, setShowTrustDevice] = useState(false);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    setCollapse(true);
  }, []);

  const handleLogIn = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const email = data.get("email");

    let authentication_successful = await Authenticate(email);
    if (!authentication_successful?.error) {
      const user = authentication_successful?.user;
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
      setShowError(authentication_successful?.error);
      clearAlerts();
    }
  };

  const handleLostAuthenticator = async () => {
    console.log("Lost your key pressed");
    navigate("/recover_account");
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

  const handleRegister = () => {
    navigate("/register");
  };

  const clearAlerts = () => {
    setTimeout(() => {
      setShowError(null);
    }, 1000 * 5);
  };

  return (
    <div>
      <>{user && <HomePage></HomePage>}</>
      <div className="CenterForm">
        <Container maxWidth="xs">
          {!user && (
            <Collapse in={collapse}>
              <Paper elevation={12} sx={{ px: 2, py: 6, mx: 1 }}>
                <Collapse in={showError !== null}>
                  <Alert severity="error">{showError}</Alert>
                </Collapse>
                <Typography variant="h4" color="primary">
                  Login
                </Typography>
                <Box component="form" onSubmit={handleLogIn} sx={{ mt: 4 }}>
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
                  <Button
                    type="submit"
                    key="log_in"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 0.5, mb: 2 }}
                  >
                    Log In
                  </Button>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Link
                          variant="body2"
                          color="secondary"
                          onClick={handleRegister}
                        >
                          Need an account?
                        </Link>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box display="flex" justifyContent="flex-end">
                        <Link
                          variant="body2"
                          color="secondary"
                          onClick={handleLostAuthenticator}
                        >
                          Lost your key?
                        </Link>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Collapse>
          )}

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
        </Container>
      </div>
    </div>
  );
}

export default LoginPage;
