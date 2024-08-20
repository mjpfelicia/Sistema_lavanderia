import React from 'react'
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';



const Header = () => {
  return (
    <div>
      <div>
        <div>
          <Nav className='responsive-menu'>
            <Nav.Item>
              <a className='menu-item' href="">Recepção</a>
            </Nav.Item>
            <Nav.Item>
              <a className='menu-item' href="">Entrada de peças </a>
            </Nav.Item>
            <Nav.Item>
              <a className='menu-item' href="">Delivery</a>
            </Nav.Item>
            <Nav.Item>
              <a className='menu-item' href="">Retorno</a>
            </Nav.Item>
            <Nav.Item>
              <a className='menu-item' href="">Entrega de peças</a>
            </Nav.Item>
            <Nav.Item>
              <a className='menu-item' href="">mapa</a>
            </Nav.Item>
            <Nav.Item>
              <a className='menu-item' href="">relatório</a>
            </Nav.Item>
            <Nav.Item>
              <a className='menu-item' href="">WhatsApp</a>
            </Nav.Item>
          </Nav>

        </div>
      </div>
    </div>
  )
}

export default Header