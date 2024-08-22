import React from 'react'
import "./Header.css"
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button/';
import { IconContext } from "react-icons";

const Header = ({ listaDeMenu }) => {
  return (
    <div>
      <h1>Sistema de lavanderia</h1>
      <Nav className='responsive-menu'>
        {listaDeMenu.map((car) => (
          <Nav.Item>
            <Button className='menu-item shadow-lg rounded'>
              <IconContext.Provider value={{ size: "2rem", color: "blue" }}>
                <car.icon></car.icon>
              </IconContext.Provider>
              <a href="">{car.name}</a>
            </Button>
          </Nav.Item>

        ))}
      </Nav>
    </div>)
}

export default Header;