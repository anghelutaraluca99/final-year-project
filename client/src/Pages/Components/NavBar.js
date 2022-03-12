import React, { useContext } from 'react';
import {Link} from 'react-router-dom';
import GetUser from '../../Utils/GetUser';
import {useState, useEffect} from 'react';
import { AppContext } from '../App/context';
import './NavBar.css';

function NavBar() {
    const { user } = useContext(AppContext);
    const navStyle= {
        color:'blanchedalmond'
    }

    // const [visible, setVisible] = useState(false);

    // const digestApiResponse = async (resp) => {

    //     if(resp?.error) {
    //         setVisible(false);
    //     } else {
    //         setVisible(true);
    //     }
    // }

    // useEffect(() => {
    //     GetUser().then(resp => digestApiResponse(resp));
    // }, [])


    return (
        <div>
            <nav>
                <h3>Final Year Project</h3>
                <ul className="nav_links">
                    {!user && <Link style={navStyle} to="/register">
                        <li>Register</li>
                    </Link>}
                    {!user && <Link style={navStyle} to="/authenticate">
                        <li>Authenticate</li>
                    </Link>}
                    {user && <Link style={navStyle} to="/settings">
                        <li>Settings</li>
                    </Link>}
                </ul>
            </nav>
        </div>
    );
}

export default NavBar;
