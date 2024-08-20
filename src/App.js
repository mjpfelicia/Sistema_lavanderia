import './App.css';
import { useState } from 'react';
import Header from "./components/Header/Header.js";
import Menu from './components/Header/Menu.js';



// 
const MyCarMenu = [
  { name: "Recepção" },
  { name: "Entrada de peças" },
  { name: "Delivery" },
  { name: "Retorno" },
  { name: "Entrega de peças" },
  { name: "mapa" },
  { name: "relatório" },
  { name: "WhatsApp" },

]



function App() {
  return (
    <div className="App">
      {/* <Header /> */}

      <div className='responsive-menu'>
        {MyCarMenu.map((car) => (
          <Menu car={car} />
        )
        )}

      </div>
    </div>
  );
}

export default App;
