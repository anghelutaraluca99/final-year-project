import React, { useContext } from "react";
import { Box, Typography } from "@mui/material/";
import { AppContext } from "./context";

function Home() {
  const { user } = useContext(AppContext);
  console.log("User: ", user);

  return (
    <div>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4"> Home page </Typography>
        {user && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            Welcome, {user?.name}!
          </Typography>
        )}
        {!user && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            Please log in.
          </Typography>
        )}
      </Box>
    </div>
  );
}

export default Home;
