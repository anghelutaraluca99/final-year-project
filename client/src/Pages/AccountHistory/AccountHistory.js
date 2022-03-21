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
  ListItemText,
} from "@mui/material";
import Devices from "@mui/icons-material/Devices";
import { GetFingerprint } from "../../Utils/FingerprintUtils";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // whiteSpace: "normal",
      wordBreak: "break-all",
    },
  })
);

function AccountHistoryPage() {
  const { user } = useContext(AppContext);
  const [fingerprints, setFingerprints] = useState(null);
  const [currentFingerprint, setCurrentFingerprint] = useState(null);

  const classes = useStyles();

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
    <div className={classes.root}>
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
                    {fingerprint?.visitorId ===
                      currentFingerprint?.visitorId && (
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: "green" }}>
                          <Devices />
                        </Avatar>
                      </ListItemAvatar>
                    )}

                    {fingerprint?.visitorId !==
                      currentFingerprint?.visitorId && (
                      <ListItemAvatar>
                        <Avatar>
                          <Devices />
                        </Avatar>
                      </ListItemAvatar>
                    )}

                    <ListItemText
                      key={`ListItemText:${fingerprint.visitorId}`}
                      primary={"Fingerprint ID:" + fingerprint.visitorId}
                      secondary={
                        "Last log in on: " +
                        new Date(fingerprint.lastUsed).toLocaleDateString() +
                        ", seen " +
                        fingerprint.times_observed +
                        " times"
                      }
                    />
                  </ListItem>
                ))}
              </Grid>
            </List>
          </Box>
        )}
        {!user && (
          <Typography variant="subheading2"> Please log in. </Typography>
        )}
      </Container>
    </div>
  );
}

export default AccountHistoryPage;
