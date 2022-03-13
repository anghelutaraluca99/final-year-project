import React from "react";
import { useContext } from "react";
import { AppContext } from "../App/context";
import { Typography, Container } from "@mui/material";

function ServicesPage() {
  const { user } = useContext(AppContext);

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5"> Services page </Typography>
      {user && (
        <Typography variant="subheading2"> Hello, {user.name}! </Typography>
      )}
      {!user && <Typography variant="subheading2"> Please log in. </Typography>}
    </Container>
  );
}

export default ServicesPage;
