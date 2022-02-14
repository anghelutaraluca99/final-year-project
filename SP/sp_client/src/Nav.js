import React from 'react';
import {Link} from 'react-router-dom';

function Nav() {

    //TODO :: Move to CSS
    const navStyle= {
        color:'blanchedalmond'
    }

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
                </ul>
            </nav>
        </div>
    );
}

export default Nav;
