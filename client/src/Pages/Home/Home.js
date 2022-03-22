import React from "react";
import { useContext, useEffect } from "react";
import { AppContext } from "../App/context";
import { Typography, Container } from "@mui/material";
import ServicesPage from "../Services/Services";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("No user");
      navigate("/login");
    }
  }, [user]);

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
      <ServicesPage />
    </>
  );
}

export default HomePage;
