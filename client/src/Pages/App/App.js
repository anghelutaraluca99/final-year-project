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
import AppBar from '../../Components/AppBar';
import { AppContext } from './context';
import { useState } from 'react';

function App() {
    const [ user, setUser ] = useState(null);
    const dispatchUserEvent = (actionType, payload) => {
		switch (actionType) {
			case 'SET_USER':
                console.log('SET_USER');
				setUser(payload);
				return;
			case 'LOGOUT_USER':
				setUser(null);
                // TODO: delete cookies
				return;
			default:
				return;
		}
	};
  return (
      <Router>
          <div className="App">
              <AppContext.Provider value={{ user, dispatchUserEvent }}>
              <AppBar/>
              {/* <NavBar /> */}
              <Routes>
                  <Route exact path='/' element={<HomePage/>}/>
                  <Route exact path='/register' element={<RegistrationPage/>}/>
                  <Route exact path='/login' element={<LoginPage/>}/>
                  {/* <Route exact path='/login' element={<LoginForm/>}/> */}
                  <Route exact path='/settings' element={<SettingsPage/>}/>
                  <Route exact path='/deleteAuthenticator' element={<DeleteAuthenticator/>}/>
                  <Route exact path='/oidc_interaction/:uid/login' element={<OIDC_login/>}/>
                  <Route exact path='/oidc_interaction/:uid/consent/:scope' element={<OIDC_consent/>}/>
              </Routes>
              </AppContext.Provider>
          </div>
      </Router>
  );
}

export default App;