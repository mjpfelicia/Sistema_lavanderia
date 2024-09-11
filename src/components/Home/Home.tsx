import React from 'react'
import Header from "../Header/Header"
import CadastroDeCliente from "../pages/CadastroDeCliente"

const Home = () => {
    return (
        <div className='content_home'>
            <div>
                <Header botaoPaginaAtiva=""/>
            </div>
            <CadastroDeCliente/>
        </div>
    )
}

export default Home;