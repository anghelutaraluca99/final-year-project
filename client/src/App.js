import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';

import './App.css';
import Nav from './Nav';
import Home from './Home';
import Reg from './Reg';
import Auth from './Auth';


function App() {
  return (
      <Router>
          <div className="App">
              <Nav />
              <Routes>
                  <Route exact path='/' element={<Home/>}/>
                  <Route exact path='/register' element={<Reg/>}/>
                  <Route exact path='/authenticate' element={<Auth/>}/>
              </Routes>
          </div>
      </Router>
  );
}

export default App;