import { useParams } from "react-router-dom";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Container,
  Typography,
} from "@mui/material";

function Interaction() {
  const { uid, scope } = useParams();
  let scope_list = scope.split(" ").slice(1);

  const handleConsent = async (e) => {
    e.preventDefault();

    // Reply to OIDC endpoint
    const OIDC_consent_response = await fetch(
      "http://localhost:3000/oidc_interaction/" + uid + "/consent",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        credentials: "include",
      }
    );
    const parsed_OIDC_consent_response = await OIDC_consent_response.json();
    console.log(
      "------- OIDC consent response: ",
      parsed_OIDC_consent_response
    );

    // Redirect
    window.location.replace(parsed_OIDC_consent_response.returnURI);

    return;
  };

  return (
    <div>
      <Container sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ mt: 2 }}>
          {" "}
          Single Sign-On Consent Page{" "}
        </Typography>
        <Typography variant="subheading2" sx={{ mt: 4 }}>
          Allow application to gain access to the following data about you?
        </Typography>

        <List dense>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            {scope_list.map((scope) => (
              <Grid item xs={12}>
                <ListItem>
                  <ListItemText primary={scope} />
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </List>
        <Button variant="contained" onClick={handleConsent} sx={{ mt: 2 }}>
          {" "}
          Give consent{" "}
        </Button>
      </Container>
    </div>
  );
}

export default Interaction;
