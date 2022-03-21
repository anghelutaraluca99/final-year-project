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
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(null);
  const [showRegisterError, setShowRegisterError] = useState(null);
  const [showDeleteError, setShowDeleteError] = useState(null);

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
    // Register new authenticator
    const registration_successful = await RegisterNewAuthenticator();

    // Display alerts accordingly
    if (!registration_successful?.error) {
      setAuthenticators([
        ...authenticators,
        registration_successful.authenticator,
      ]);
      setShowRegisterSuccess(registration_successful?.message);
      clearAlerts();
    } else {
      console.log(
        "registration_successful?.error: ",
        registration_successful?.error
      );
      setShowRegisterError(registration_successful.error);
      clearAlerts();
    }
  };

  const handleDeletion = async (e) => {
    e.preventDefault();
    let res;
    // If key has been selected in the list
    if (selectedKey) {
      // Get credentialID of the key to be deleted
      let respObj = {};
      respObj.credentialID = selectedKey?.credentialID;
      // Send request to delete key
      res = await fetch("http://localhost:3000/user/authenticators", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(respObj),
      });
      // Parse response and display alert accordingly
      let parsed_resp = await res.json();
      if (!parsed_resp?.error) {
        setAuthenticators(
          authenticators.filter(
            (authenticator) => authenticator !== selectedKey
          )
        );
        setShowDeleteSuccess(parsed_resp?.message);
        clearAlerts();
      } else {
        setShowDeleteError(parsed_resp?.error);
        clearAlerts();
      }
    }
  };

  const handleKeyClick = (e, key) => {
    setSelectedKey(key);
  };

  const clearAlerts = () => {
    setTimeout(() => {
      setShowRegisterSuccess(null);
      setShowRegisterError(null);
      setShowDeleteError(null);
      setShowDeleteSuccess(null);
    }, 1000 * 5);
  };

  return (
    <div className={classes.root}>
      <Container sx={{ mt: 2 }}>
        <Collapse in={showRegisterSuccess !== null}>
          <Alert severity="success">{showRegisterSuccess}</Alert>
        </Collapse>

        <Collapse in={showDeleteSuccess !== null}>
          <Alert severity="success">{showDeleteSuccess}</Alert>
        </Collapse>

        <Collapse in={showRegisterError !== null}>
          <Alert severity="error">{showRegisterError}</Alert>
        </Collapse>

        <Collapse in={showDeleteError !== null}>
          <Alert severity="error">{showDeleteError}</Alert>
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
                        secondary={
                          "Last used on: " +
                          new Date(authenticator.updatedAt).toLocaleDateString()
                        }
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
