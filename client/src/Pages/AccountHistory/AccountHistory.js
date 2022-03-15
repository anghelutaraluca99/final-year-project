import React from "react";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../App/context";
import {
  Avatar,
  Typography,
  Container,
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Devices from "@mui/icons-material/Devices";
import { GetFingerprint } from "../../Utils/FingerprintUtils";

function AccountHistoryPage() {
  const { user } = useContext(AppContext);
  const [fingerprints, setFingerprints] = useState(null);
  const [currentFingerprint, setCurrentFingerprint] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/user/fingerprints", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    }).then((data) => parseFingerprints(data));
  }, []);

  const parseFingerprints = async (data) => {
    let parsedData = await data.json();
    setFingerprints(parsedData.fingerprints);

    let current_fingerprint = await GetFingerprint();
    setCurrentFingerprint(current_fingerprint);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h5"> Account History </Typography>
      {user && fingerprints && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <List dense>
            <Grid container spacing={2}>
              {fingerprints.map((fingerprint) => (
                <ListItem
                  xs={12}
                  key={`ListItem:${fingerprint.visitorId}`}
                  value={fingerprint.visitorId}
                >
                  {fingerprint?.visitorId === currentFingerprint?.visitorId && (
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: "green" }}>
                        <Devices />
                      </Avatar>
                    </ListItemAvatar>
                  )}

                  {fingerprint?.visitorId !== currentFingerprint?.visitorId && (
                    <ListItemAvatar>
                      <Avatar>
                        <Devices />
                      </Avatar>
                    </ListItemAvatar>
                  )}

                  <ListItemText
                    key={`ListItemText:${fingerprint.visitorId}`}
                    primary={"Fingerprint ID:" + fingerprint.visitorId}
                    secondary={"Last used on: " + fingerprint.lastUsed}
                  />
                  <ListItemText
                    key={`ListItemText2:${fingerprint.visitorId}`}
                    secondary={"Used " + fingerprint.lastUsed}
                  />
                </ListItem>
              ))}
            </Grid>
          </List>
        </Box>
      )}
      {!user && <Typography variant="subheading2"> Please log in. </Typography>}
    </Container>
  );
}

export default AccountHistoryPage;
