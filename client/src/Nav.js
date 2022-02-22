import React from 'react';
import {Link} from 'react-router-dom';
import GetUser from './GetUser';
import {useState, useEffect} from 'react';

function Nav() {

    //TODO :: Move to CSS
    const navStyle= {
        color:'blanchedalmond'
    }

    const [visible, setVisible] = useState(false);

    const digestApiResponse = async (resp) => {

        if(typeof(resp?.error) !== "undefined") {
            setVisible(false);
        } else {
            setVisible(true);
        }
    }

    useEffect(() => {
        GetUser().then(resp => digestApiResponse(resp));
    }, [])


    return (
        <div>
            <nav>
                <h3>TODO :: LOGO</h3>
                <ul className="nav_links">
                    <Link style={navStyle} to="/register">
                        <li>Register</li>
                    </Link>
                    <Link  style={navStyle} to="/authenticate">
                        <li>Authenticate</li>
                    </Link>
                    {visible && <Link  style={navStyle} to="/settings">
                        <li>Settings</li>
                    </Link>}
                </ul>
            </nav>
        </div>
    );
}

export default Nav;
