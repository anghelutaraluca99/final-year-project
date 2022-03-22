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
    if (!parsedData.error) {
      setFingerprints(parsedData.fingerprints);

      let current_fingerprint = await GetFingerprint();
      setCurrentFingerprint(current_fingerprint);
    }
  };

  return (
    <div className={classes.root}>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" color="primary" sx={{ mt: 2, mb: 2 }}>
          {" "}
          Account History{" "}
        </Typography>
        {user && fingerprints && (
          <Box sx={{ width: "100%", mt: 2 }}>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <List dense>
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
                        "Last log on: " +
                        new Date(fingerprint.lastUsed).toLocaleDateString() +
                        ", seen " +
                        fingerprint.times_observed +
                        " times"
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Box>
        )}
        {!fingerprints && (
          <Typography>
            No history of trusted browsers exists for this account.
          </Typography>
        )}
        {!user && (
          <Typography variant="subheading2"> Please log in. </Typography>
        )}
      </Container>
    </div>
  );
}

export default AccountHistoryPage;
