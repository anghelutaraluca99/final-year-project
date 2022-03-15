import { Box, Button, Typography } from "@mui/material/";
import "./App.css";

function Login() {
  async function handleLogIn(e) {
    e.preventDefault();
    window.location.replace("http://localhost:4000/login");
  }

  return (
    <div>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5"> Login Page </Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleLogIn}>
          Log in with OIDC Identity Provider
        </Button>
      </Box>
    </div>
  );
}

export default Login;
