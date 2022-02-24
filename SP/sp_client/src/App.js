import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import './App.css';
import Nav from './Nav';
import Home from './Home';
import Auth from './Auth';
import SAMLAssertion from './SAMLAssertion';


function App() {

return (
    <Router>
        <div className="App">
            <Nav />
            <Routes>
                <Route exact path='/' element={<Home/>}/>
                <Route exact path='/auth' element={<Auth/>}/>
                <Route exact path='/saml_assertion' element={<SAMLAssertion/>}/>
            </Routes>
        </div>
    </Router>
);
}

export default App;