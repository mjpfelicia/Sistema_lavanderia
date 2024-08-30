import React from 'react'
import Header from "../Header/Header"
import CadastroDeCliente from "../pages/CadastroDeCliente/CadastroDeCliente.js"

const Home = () => {
    return (
        <div className='content_home'>
            <div>
                <Header />
            </div>
            <CadastroDeCliente/>
        </div>
    )
}

export default Home;