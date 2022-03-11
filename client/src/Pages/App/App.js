import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import './App.css';
import NavBar from '../Components/NavBar';
import HomePage from '../Home/Home';
import RegistrationPage from '../Register/Register';
import LoginPage from '../Login/Login';
import OIDC_login from '../Interaction/Login';
import OIDC_consent from '../Interaction/Consent';
import SettingsPage from '../Settings/Settings';
import DeleteAuthenticator from '../Settings/DeleteAuthenticator';

function App() {
  return (
      <Router>
          <div className="App">
              <NavBar />
              <Routes>
                  <Route exact path='/' element={<HomePage/>}/>
                  <Route exact path='/register' element={<RegistrationPage/>}/>
                  <Route exact path='/authenticate' element={<LoginPage/>}/>
                  <Route exact path='/settings' element={<SettingsPage/>}/>
                  <Route exact path='/deleteAuthenticator' element={<DeleteAuthenticator/>}/>
                  <Route exact path='/oidc_interaction/:uid/login' element={<OIDC_login/>}/>
                  <Route exact path='/oidc_interaction/:uid/consent/:scope' element={<OIDC_consent/>}/>
              </Routes>
          </div>
      </Router>
  );
}

export default App;