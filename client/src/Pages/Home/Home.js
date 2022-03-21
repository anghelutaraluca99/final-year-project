import React from "react";
import { useContext } from "react";
import { AppContext } from "../App/context";
import { Typography, Container } from "@mui/material";
import ServicesPage from "../Services/Services";
import LoginPage from "../Login/Login";

function HomePage() {
  const { user } = useContext(AppContext);

  return (
    <>
      <Container sx={{ mt: 2 }}>
        {user && (
          <Typography variant="h4" color="primary">
            Hello, {user.name}!
          </Typography>
        )}
        {user && (
          <Container sx={{ m: 2 }}>
            <Typography variant="subheading2">
              Check out these amazing services!
            </Typography>
          </Container>
        )}
      </Container>
      {user && <ServicesPage />}
      {!user && <LoginPage />}
    </>
  );
}

export default HomePage;
