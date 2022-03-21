import React from "react";
import { useContext } from "react";
import { AppContext } from "../App/context";
import {
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
  Container,
} from "@mui/material";

function ServicesPage() {
  const { user } = useContext(AppContext);

  const redirectToDogsService = () => {
    window.location.href = "http://localhost:4001";
  };

  const redirectToCatsService = () => {
    window.location.href = "http://localhost:5001";
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5"> Services page </Typography>
      {/* {user && (
        <Typography variant="subheading2"> Hello, {user.name}! </Typography>
      )}
      {!user && <Typography variant="subheading2"> Please log in. </Typography>} */}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Card>
            <CardActionArea onClick={() => redirectToDogsService()}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 30 }}
                  color="text.secondary"
                  gutterBottom
                >
                  🐶
                </Typography>
                <Typography
                  sx={{ fontSize: 16 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Get images of dogs
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card>
            <CardActionArea onClick={() => redirectToCatsService()}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 30 }}
                  color="text.secondary"
                  gutterBottom
                >
                  😺
                </Typography>
                <Typography
                  sx={{ fontSize: 16 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Get images of cats
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ServicesPage;
