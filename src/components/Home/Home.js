import React from 'react'
import Header from "../Header/Header"
import CadastroCliente from '../pages/CadastroCliente/CadastroCliente'

const Home = () => {
    return (
        <div className='content_home'>
            <div>
                <Header />
            </div>
            < CadastroCliente/>
        </div>
    )
}

export default Home;