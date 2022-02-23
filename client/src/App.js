import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import './App.css';
import Nav from './Nav';
import Home from './Home';
import Reg from './Reg';
import Auth from './Auth';
import Settings from './Settings';
import DeleteAuthenticator from './DeleteAuthenticator';
import Services from './Services';


function App() {
  return (
      <Router>
          <div className="App">
              <Nav />
              <Routes>
                  <Route exact path='/' element={<Home/>}/>
                  <Route exact path='/register' element={<Reg/>}/>
                  <Route exact path='/authenticate' element={<Auth/>}/>
                  <Route exact path='/settings' element={<Settings/>}/>
                  <Route exact path='/deleteAuthenticator' element={<DeleteAuthenticator/>}/>
                  <Route exact path='/services' element={<Services/>}/>
              </Routes>
          </div>
      </Router>
  );
}

export default App;