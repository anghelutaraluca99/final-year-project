import "./Settings.css";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { RegisterNewAuthenticator } from "../../Utils/WebAuthnUtils";
import {
  Alert,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import Key from "@mui/icons-material/Key";
import { AppContext } from "../App/context";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // whiteSpace: "normal",
      wordBreak: "break-all",
    },
  })
);

function ManageAuthenticatorsPage() {
  const { user } = useContext(AppContext);
  const [authenticators, setAuthenticators] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const classes = useStyles();

  const setKeys = async (data) => {
    const parsedData = await data.json();
    if (data.status === 200) {
      setAuthenticators(parsedData);
    } else {
      console.log("Error when fetching authenticators");
    }
  };

  useEffect(() => {
    fetch("http://localhost:3000/user/authenticators", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    }).then((data) => setKeys(data));
  }, []);

  const handleRegistration = async () => {
    let registration_successful = await RegisterNewAuthenticator();
    if (!registration_successful?.error) {
      setAuthenticators([
        ...authenticators,
        registration_successful.authenticator,
      ]);
      setShowSuccess(true);
      clearAlerts();
    } else {
      setShowError(true);
      clearAlerts();
    }
  };

  const handleDeletion = async (e) => {
    e.preventDefault();
    let res;
    if (selectedKey) {
      let respObj = {};
      respObj.credentialID = selectedKey?.credentialID;
      res = await fetch("http://localhost:3000/user/authenticators", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(respObj),
      });
      let parsed_resp = await res.json();
      if (!parsed_resp?.error) {
        setAuthenticators(
          authenticators.filter(
            (authenticator) => authenticator !== selectedKey
          )
        );
      } else {
        // display error
      }
    }
  };

  const handleKeyClick = (e, key) => {
    setSelectedKey(key);
  };

  const clearAlerts = () => {
    setTimeout(() => {
      setShowSuccess(false);
      setShowError(false);
    }, 1000 * 3);
  };

  return (
    <div className={classes.root}>
      <Container sx={{ mt: 2 }}>
        <Collapse in={showSuccess}>
          <Alert severity="success">Authenticator registered.</Alert>
        </Collapse>

        <Collapse in={showError}>
          <Alert severity="error">Authenticator could not be registered.</Alert>
        </Collapse>

        <Typography variant="h5" key="manage_authenticators" sx={{ mt: 2 }}>
          Manage Authenticators
        </Typography>
        {/* List of authenticators */}
        {user && authenticators && (
          <Box sx={{ width: "100%", mt: 2 }}>
            <List dense>
              <Grid container spacing={2}>
                {authenticators.map((authenticator) => (
                  <ListItem
                    xs={12}
                    key={`ListItem:${authenticator.credentialID}`}
                    value={authenticator.credentialID}
                  >
                    <ListItemButton
                      key={`ListItemButton:${authenticator.credentialID}`}
                      value={authenticator.credentialID}
                      selected={selectedKey === authenticator}
                      onClick={(event) => handleKeyClick(event, authenticator)}
                    >
                      <ListItemIcon
                        key={`ListItemIcon:${authenticator.credentialID}`}
                      >
                        <Key />
                      </ListItemIcon>
                      <ListItemText
                        key={`ListItemText:${authenticator.credentialID}`}
                        primary={authenticator.credentialID}
                        secondary={"Last used on: " + authenticator.updatedAt}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </Grid>
            </List>
          </Box>
        )}
        {/* Button to delete authenticators */}
        {user && (
          <Grid container spacing="1" alignItems="center">
            <Box sx={{ width: "100%", mt: 2 }}>
              <Button
                key="delete_authenticator"
                onClick={handleDeletion}
                value="Delete Authenticator"
                variant="outlined"
                sx={{ minWidth: { xs: "80%", md: "40%" } }}
              >
                Delete authenticator
              </Button>
            </Box>
            {/* Button to add a new authenticator */}
            <Box sx={{ width: "100%", mt: 2 }}>
              <Button
                key="register_authenticator"
                onClick={handleRegistration}
                value="Register New Authenticator"
                variant="outlined"
                sx={{ minWidth: { xs: "80%", md: "40%" } }}
              >
                Register new authenticator
              </Button>
            </Box>
          </Grid>
        )}
        {!user && (
          <Typography variant="subheading2" key="unauthorised_authenticators">
            Unauthorised. Please log in.
          </Typography>
        )}
      </Container>
    </div>
  );
}

export default ManageAuthenticatorsPage;
