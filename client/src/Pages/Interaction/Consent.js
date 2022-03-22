import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
  Collapse,
  Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";

function Interaction() {
  const { uid, app, scope } = useParams();
  let scope_list = scope.split(" ").slice(1);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    setCollapse(true);
  }, []);

  const handleConsent = async (e) => {
    e.preventDefault();

    // Reply to OIDC endpoint
    const OIDC_consent_response = await fetch(
      "http://localhost:3000/oidc_interaction/" + uid + "/consent",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        credentials: "include",
      }
    );
    const parsed_OIDC_consent_response = await OIDC_consent_response.json();
    console.log(
      "------- OIDC consent response: ",
      parsed_OIDC_consent_response
    );

    // Redirect
    window.location.replace(parsed_OIDC_consent_response.returnURI);

    return;
  };

  return (
    <div className="CenterForm">
      <Container maxWidth="xs">
        <Collapse in={collapse}>
          <Paper elevation={12} sx={{ px: 2, py: 6, mx: 1 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" color="primary">
                {app} wants access to your FYP data
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subheading2">
                This will share the following details with {app}:
              </Typography>
            </Box>

            <Grid container direction="column" alignItems="center">
              {scope_list.map((scope) => (
                <Grid item xs={12} sx={{ mt: 0.5 }} key={"GridItem:" + scope}>
                  <Typography variant="body2"> {scope} </Typography>
                </Grid>
              ))}
            </Grid>
            <Button variant="contained" onClick={handleConsent} sx={{ mt: 2 }}>
              Allow
            </Button>
          </Paper>
        </Collapse>
      </Container>
    </div>
  );
}

export default Interaction;
