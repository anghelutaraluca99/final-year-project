import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Nav from "./Nav";
import Home from "./Home";
import Auth from "./Auth";
import ReceiveOIDCToken from "./ReceiveOIDCToken";
import Dogs from "./Dogs";

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/auth" element={<Auth />} />
          <Route
            exact
            path="/receiveOIDCToken/:access_token"
            element={<ReceiveOIDCToken />}
          />
          <Route exact path="/dogs" element={<Dogs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
