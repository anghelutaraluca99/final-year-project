import "./Settings.css";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { RegisterNewAuthenticator } from "../../Utils/WebAuthnUtils";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
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

  const classes = useStyles();

  const setKeys = async (data) => {
    const parsedData = await data.json();
    console.log(parsedData);
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
    if (registration_successful) {
      // show successful
    } else {
      //display error
    }
  };

  const handleDeletion = (e) => {
    // Handle Delete
  };

  const handleKeyClick = (e, key_credentialID) => {
    setSelectedKey(key_credentialID);
  };

  return (
    <div className={classes.root}>
      <Container sx={{ mt: 2 }}>
        <Typography variant="h5"> Manage Authenticators </Typography>

        {/* List of authenticators */}
        {user && authenticators && (
          <Box sx={{ width: "100%", mt: 2 }}>
            <List dense="true">
              <Grid container spacing={2}>
                {authenticators.map((authenticator) => (
                  <ListItem item xs={12}>
                    <ListItemButton
                      key={authenticator.credentialID}
                      value={authenticator.credentialID}
                      selected={selectedKey === authenticator.credentialID}
                      onClick={(event) =>
                        handleKeyClick(event, authenticator.credentialID)
                      }
                    >
                      <ListItemIcon>
                        <Key />
                      </ListItemIcon>
                      <ListItemText
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
          <Typography variant="subheading2">
            {" "}
            Unauthorised. Please log in.{" "}
          </Typography>
        )}
      </Container>
    </div>
  );
}

export default ManageAuthenticatorsPage;
