import React from 'react'
import "./Header.css"
import Nav from 'react-bootstrap/Nav';
import ButtonComHover from "../ButtonHover/ButtoComHover"

const Header = ({ listaDeMenu }) => {

  return (
    <div>
      <h1 className='title-header'>Sistema de lavanderia</h1>
      <Nav className='responsive-menu'>
        {listaDeMenu.map((car) => (
          <Nav.Item>
            <ButtonComHover card={car}>
            </ButtonComHover>
          </Nav.Item>

        ))}
      </Nav>


    </div>)
}

export default Header;