import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import './App.css';
import NavBar from '../Components/NavBar';
import Home from '../Home/Home';
import Register from '../Register/Register';
import Login from '../Login/Login';
import Settings from '../Settings/Settings';
import DeleteAuthenticator from '../Settings/DeleteAuthenticator';
import Services from '../Services/Services';


function App() {
  return (
      <Router>
          <div className="App">
              <NavBar />
              <Routes>
                  <Route exact path='/' element={<Home/>}/>
                  <Route exact path='/register' element={<Register/>}/>
                  <Route exact path='/authenticate' element={<Login/>}/>
                  <Route exact path='/settings' element={<Settings/>}/>
                  <Route exact path='/deleteAuthenticator' element={<DeleteAuthenticator/>}/>
                  <Route exact path='/services' element={<Services/>}/>
              </Routes>
          </div>
      </Router>
  );
}

export default App;