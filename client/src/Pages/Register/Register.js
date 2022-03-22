import {
  Paper,
  Typography,
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
  Grid,
  Link,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { Register } from "../../Utils/WebAuthnUtils";
import { useNavigate } from "react-router-dom";
import {
  ValidateFingerprint,
  SaveFingerprint,
} from "../../Utils/FingerprintUtils";
import { AppContext } from "../App/context";
import HomePage from "../Home/Home";

function RegistrationPage() {
  const navigate = useNavigate();

  const { user, dispatchUserEvent } = useContext(AppContext);
  const [showError, setShowError] = useState(null);
  const [showTrustDevice, setShowTrustDevice] = useState(false);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    setCollapse(true);
  }, []);

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

    if (!registration_successful?.error) {
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
      setShowError(registration_successful?.error);
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
  const handleLogin = () => {
    navigate("/login");
  };

  const clearAlerts = () => {
    setTimeout(() => {
      setShowError(null);
    }, 1000 * 3);
  };

  return (
    <div>
      {user && <HomePage></HomePage>}
      <div className="CenterForm">
        <Container maxWidth="xs">
          {!user && (
            <Collapse in={collapse}>
              <Paper elevation={12} sx={{ px: 2, py: 6 }}>
                <Collapse in={showError !== null}>
                  <Alert severity="error">{showError}</Alert>
                </Collapse>
                <Typography variant="h4" color="primary">
                  Register
                </Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 4 }}>
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
                    sx={{ mt: 0.5, mb: 1 }}
                  >
                    Register
                  </Button>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {/* <Box display="flex" justifyContent="flex-start"> */}
                      <Link
                        variant="body2"
                        color="secondary"
                        onClick={handleLogin}
                      >
                        Already have an account?
                      </Link>
                      {/* </Box> */}
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

export default RegistrationPage;
