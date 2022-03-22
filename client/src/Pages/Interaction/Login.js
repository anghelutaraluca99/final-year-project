import {
  Alert,
  Button,
  Collapse,
  TextField,
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Authenticate } from "../../Utils/WebAuthnUtils";
import { AppContext } from "../App/context";

function OIDC_Login() {
  const navigate = useNavigate();
  let { uid } = useParams();
  let { app } = useParams();
  const [showError, setShowError] = useState(null);
  const { dispatchUserEvent } = useContext(AppContext);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    setCollapse(true);
  }, []);

  const handleLogIn = async (e) => {
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
        "/oidc_interaction/" +
          parsed_new_uid +
          "/" +
          app +
          "/consent/" +
          parsed_scope
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
    <div className="CenterForm">
      <Container maxWidth="xs">
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
            </Box>
          </Paper>
        </Collapse>
      </Container>
    </div>
  );
}

export default OIDC_Login;
