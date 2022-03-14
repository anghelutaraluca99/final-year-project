import React from "react";
import { useContext } from "react";
import { AppContext } from "../App/context";
import { Typography, Container, Box, Grid } from "@mui/material";

function ProfilePage() {
  const { user } = useContext(AppContext);

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 2 }}>
      <Typography variant="h5"> Profile page </Typography>
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
      {!user && <Typography variant="subheading2"> Please log in. </Typography>}
    </Container>
  );
}

export default ProfilePage;
