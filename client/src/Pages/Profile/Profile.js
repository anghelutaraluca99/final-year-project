import React from "react";
import { useContext } from "react";
import { AppContext } from "../App/context";
import { Typography, Container, Box, Grid, Paper } from "@mui/material";

function ProfilePage() {
  const { user } = useContext(AppContext);

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ mt: 2 }}
      style={{
        position: "absolute",
        left: "50%",
        top: "40%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Paper elevation={12} sx={{ px: 2, py: 6 }}>
        <Typography variant="h4" color="primary">
          {" "}
          Profile{" "}
        </Typography>
        {user && (
          <Box>
            <Grid>
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Typography variant="h6">Email: </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">Username:</Typography>
                <Typography variant="body1">{user.username}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6">Full name:</Typography>
                <Typography variant="body1">{user.name}</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
        {!user && (
          <Typography variant="subheading2"> Please log in. </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default ProfilePage;
