import React from 'react'
import Nav from 'react-bootstrap/Nav';
import "./Header.css"

const Menu = ({ car }) => {
    return (
        <div>
            <nav>
                <Nav.Item>
                    <a className='menu-item' href="">{car.name}</a>
                </Nav.Item>
            </nav>

        </div>
    )
}

export default Menu