import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../Home/Home";
import RegistrationPage from "../Register/Register";
import LoginPage from "../Login/Login";
import OIDC_login from "../Interaction/Login";
import OIDC_consent from "../Interaction/Consent";
import ManageAuthenticatorsPage from "../ManageAuthenticators/ManageAuthenticators";
import LogoutPage from "../LogoutPage/Logout";
import AppBar from "../../Components/AppBar";
import ServicesPage from "../Services/Services";
import RecoverAccount from "../RecoverAccount/RecoverAccount";
import ProfilePage from "../Profile/Profile";
import AccountHistoryPage from "../AccountHistory/AccountHistory";
import { AppContext } from "./context";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { myTheme } from "./AppMuiTheme";
import NotFoundPage from "../NotFound/NotFound";

function App() {
  const [user, setUser] = useState(null);
  const theme = createTheme(myTheme);
  const dispatchUserEvent = (actionType, payload) => {
    switch (actionType) {
      case "SET_USER":
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
    const userLocalStorage = window.localStorage.getItem("user");
    if (userLocalStorage) {
      console.log("Found user in localstorage: ", JSON.parse(userLocalStorage));
      setUser(JSON.parse(userLocalStorage));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <AppContext.Provider value={{ user, dispatchUserEvent }}>
          <ThemeProvider theme={theme}>
            <AppBar />
            <Routes>
              {/* Route accessible to any user */}
              <Route exact path="/" element={<HomePage />} />
              <Route exact path="/services" element={<ServicesPage />} />
              <Route
                exact
                path="/oidc_interaction/:uid/:app/login"
                element={<OIDC_login />}
              />
              <Route
                exact
                path="/oidc_interaction/:uid/:app/consent/:scope"
                element={<OIDC_consent />}
              />
              <Route exact path="/register" element={<RegistrationPage />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route
                exact
                path="/recover_account"
                element={<RecoverAccount />}
              />
              <Route exact path="/profile" element={<ProfilePage />} />

              {/* Routes accessible only to users who are logged in */}
              {user && <Route exact path="/logout" element={<LogoutPage />} />}
              {user && (
                <Route
                  exact
                  path="/account_history"
                  element={<AccountHistoryPage />}
                />
              )}
              {user && (
                <Route
                  exact
                  path="/manage_authenticators"
                  element={<ManageAuthenticatorsPage />}
                />
              )}
              {/* Handle unsupported pages */}
              <Route exact path="*" element={<NotFoundPage />} />
            </Routes>
          </ThemeProvider>
        </AppContext.Provider>
      </div>
    </Router>
  );
}

export default App;
