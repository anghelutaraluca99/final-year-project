import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import './App.css';
import Nav from './Nav';
import Home from './Home';


function App() {
return (
    <Router>
        <div className="App">
            <Nav />
            <Routes>
                <Route exact path='/' element={<Home/>}/>
            </Routes>
        </div>
    </Router>
);
}

export default App;