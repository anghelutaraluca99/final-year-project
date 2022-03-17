import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AppContext } from "./context";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { myTheme } from "./AppMuiTheme";

import Home from "./Home";
import Login from "./Login";
import ReceiveOIDCToken from "./ReceiveOIDCToken";
import Cats from "./Cats";
import AppBar from "./AppBar";
import Logout from "./Logout";

function App() {
  const [user, setUser] = useState(null);
  const theme = createTheme(myTheme);
  const dispatchUserEvent = (actionType, payload) => {
    switch (actionType) {
      case "SET_USER":
        console.log("SET_USER");
        console.log(payload);
        setUser(payload);
        window.localStorage.setItem("user", JSON.stringify(payload));
        return;
      case "LOGOUT_USER":
        setUser(null);
        window.localStorage.clear();
        return;
      default:
        return;
    }
  };
  useEffect(() => {
    const userLocalStorage = JSON.parse(window.localStorage.getItem("user"));
    if (userLocalStorage) {
      console.log("Found user in localstorage: ", userLocalStorage);
      console.log(
        "Found user in localstorage: ",
        JSON.stringify(userLocalStorage)
      );
      setUser(userLocalStorage);
    }
  }, []);

  return (
    <Router>
      <AppContext.Provider value={{ user, dispatchUserEvent }}>
        <ThemeProvider theme={theme}>
          <AppBar />
          <div className="App">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route
                exact
                path="/receiveOIDCToken/:access_token"
                element={<ReceiveOIDCToken />}
              />
              <Route exact path="/cats" element={<Cats />} />
            </Routes>
          </div>
        </ThemeProvider>
      </AppContext.Provider>
    </Router>
  );
}

export default App;
