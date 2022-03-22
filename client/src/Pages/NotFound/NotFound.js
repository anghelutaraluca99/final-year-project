import React from "react";
import { Typography, Container } from "@mui/material";

function NotFoundPage() {
  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4" color="primary">
        404 : Page not found
      </Typography>
    </Container>
  );
}

export default NotFoundPage;
